# Windows PowerShell 5.1 or newer. No administrator rights needed.
param(
    # Set this to a folder to skip the folder picker, e.g. 'E:\Website ZIPs'
    [string]$WatchFolder = '',
    # Leave blank to detect Firefox automatically.
    [string]$FirefoxPath = '',
    # Ignore the saved folder and show the picker again.
    [switch]$ChooseFolder
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
# Call the Windows shell directly instead of VisualBasic's DeleteDirectory wrapper.
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class ZipWatcherShell {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct FileOperation {
        public IntPtr hwnd;
        public uint operation;
        public IntPtr from;
        public IntPtr to;
        public ushort flags;
        [MarshalAs(UnmanagedType.Bool)] public bool aborted;
        public IntPtr mappings;
        public IntPtr title;
    }
    [DllImport("shell32.dll", CharSet = CharSet.Unicode, ExactSpelling = true)]
    private static extern int SHFileOperationW(ref FileOperation operation);
    public static void Recycle(string path) {
        IntPtr buffer = Marshal.StringToHGlobalUni(path + "\0\0");
        try {
            var op = new FileOperation();
            op.operation = 3; // FO_DELETE
            op.from = buffer;
            op.flags = 0x0040 | 0x0010 | 0x0004 | 0x0400;
            int result = SHFileOperationW(ref op);
            if (result != 0 || op.aborted)
                throw new InvalidOperationException("Recycle operation failed (code " + result + ").");
        } finally { Marshal.FreeHGlobal(buffer); }
    }
}
'@

$settingsPath = Join-Path $PSScriptRoot 'WatcherSettings.json'
if ($ChooseFolder) {
    $WatchFolder = ''
} elseif (-not $WatchFolder -and (Test-Path -LiteralPath $settingsPath)) {
    try {
        $settings = Get-Content -LiteralPath $settingsPath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($settings.WatchFolder -is [string] -and [IO.Directory]::Exists($settings.WatchFolder)) {
            $WatchFolder = $settings.WatchFolder
            Write-Host "Using saved folder: $WatchFolder" -ForegroundColor Cyan
        } else {
            Write-Warning 'The saved folder is unavailable. Please choose a folder again.'
        }
    } catch {
        Write-Warning 'The settings file could not be read. Please choose a folder again.'
    }
}
if (-not $WatchFolder) {
    Add-Type -AssemblyName System.Windows.Forms
    $picker = New-Object System.Windows.Forms.FolderBrowserDialog
    $picker.Description = 'Choose the folder to watch for website ZIP files'
    try {
        if ($picker.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { exit }
        $WatchFolder = $picker.SelectedPath
    } finally { $picker.Dispose() }
}
$WatchFolder = (Get-Item -LiteralPath $WatchFolder).FullName
if (-not [IO.Directory]::Exists($WatchFolder)) { throw 'Choose a folder, not a file.' }

# Write alongside the script, regardless of the launcher's working directory.
# The package does not include a settings file, so updates preserve your choice.
$settingsTemp = $settingsPath + '.' + [Guid]::NewGuid().ToString('N') + '.tmp'
try {
    $json = @{ WatchFolder = $WatchFolder } | ConvertTo-Json
    [IO.File]::WriteAllText($settingsTemp, $json, [Text.UTF8Encoding]::new($false))
    if ([IO.File]::Exists($settingsPath)) {
        [IO.File]::Replace($settingsTemp, $settingsPath, $null)
    } else {
        [IO.File]::Move($settingsTemp, $settingsPath)
    }
} catch {
    Write-Warning "Could not save the folder setting: $($_.Exception.Message). Keep the script in a writable folder."
} finally {
    if ([IO.File]::Exists($settingsTemp)) { [IO.File]::Delete($settingsTemp) }
}

if (-not $FirefoxPath) {
    $candidates = @(
        "$env:ProgramFiles\Mozilla Firefox\firefox.exe",
        "${env:ProgramFiles(x86)}\Mozilla Firefox\firefox.exe",
        "$env:LOCALAPPDATA\Mozilla Firefox\firefox.exe"
    )
    foreach ($key in @(
        'HKCU:\Software\Microsoft\Windows\CurrentVersion\App Paths\firefox.exe',
        'HKLM:\Software\Microsoft\Windows\CurrentVersion\App Paths\firefox.exe'
    )) {
        if (Test-Path -LiteralPath $key) { $candidates += (Get-Item -LiteralPath $key).GetValue('') }
    }
    $command = Get-Command firefox.exe -ErrorAction SilentlyContinue
    if ($command) { $candidates += $command.Source }
    $FirefoxPath = $candidates | Where-Object { $_ -and [IO.File]::Exists($_) } | Select-Object -First 1
}
if (-not $FirefoxPath -or -not [IO.File]::Exists($FirefoxPath)) {
    throw 'Firefox was not found. Set FirefoxPath near the top of this script to your firefox.exe path.'
}

function Get-FreePath([string]$Stem, [string]$Suffix, [string]$Extension) {
    $candidate = Join-Path $WatchFolder ($Stem + $Suffix + $Extension)
    $number = 2
    while (Test-Path -LiteralPath $candidate) {
        $candidate = Join-Path $WatchFolder ($Stem + "_$number" + $Suffix + $Extension)
        $number++
    }
    return $candidate
}

function Close-FirefoxWindows {
    Write-Host 'Closing existing Firefox tabs/windows before cleanup...' -ForegroundColor Cyan
    $session = (Get-Process -Id $PID).SessionId
    $requested = @{}
    $lastNotice = [DateTime]::UtcNow
    while ($true) {
        $running = @(Get-Process -Name firefox -ErrorAction SilentlyContinue |
            Where-Object { $_.SessionId -eq $session })
        if ($running.Count -eq 0) { return }
        foreach ($process in $running) {
            try {
                $handle = $process.MainWindowHandle
                if ($handle -ne [IntPtr]::Zero -and -not $requested.ContainsKey($handle.ToInt64())) {
                    if ($process.CloseMainWindow()) { $requested[$handle.ToInt64()] = $true }
                }
            } catch { if (-not $process.HasExited) { Write-Warning $_.Exception.Message } }
        }
        if (([DateTime]::UtcNow - $lastNotice).TotalSeconds -ge 10) {
            Write-Host 'Waiting for Firefox to exit. Accept any close-tabs prompt, or close Firefox manually. Ctrl+C stops the watcher.' -ForegroundColor Yellow
            $lastNotice = [DateTime]::UtcNow
            $requested.Clear()
        }
        Start-Sleep -Milliseconds 500
    }
}

function Remove-ProcessedItem([string]$ItemPath) {
    if (-not (Test-Path -LiteralPath $ItemPath)) { return }
    try {
        # Only fixed local drives are sent to the shell's Recycle Bin.
        $drive = [IO.DriveInfo]::new([IO.Path]::GetPathRoot($ItemPath))
        if ($drive.DriveType -ne [IO.DriveType]::Fixed) { throw 'Recovery storage required for this drive.' }
        [ZipWatcherShell]::Recycle([IO.Path]::GetFullPath($ItemPath))
        if (Test-Path -LiteralPath $ItemPath) { throw 'The shell did not remove the item.' }
    } catch {
        if (-not (Test-Path -LiteralPath $ItemPath)) { return }
        # If recycling fails, remove it from the watched folder without losing it.
        $recovery = Join-Path $env:LOCALAPPDATA ('ZipFirefoxWatcher\Recovery\' + [Guid]::NewGuid().ToString('N'))
        [void][IO.Directory]::CreateDirectory($recovery)
        Move-Item -LiteralPath $ItemPath -Destination $recovery
        Write-Host "Recycle Bin unavailable; old item moved to: $recovery" -ForegroundColor Yellow
    }
}

function Remove-OldProcessedZips([string]$KeepZip, [string]$KeepFolder) {
    # Only processed archives and their exact matching extraction folders.
    $oldZips = @(Get-ChildItem -LiteralPath $WatchFolder -File -Filter '*.zip' |
        Where-Object { $_.BaseName -match '(?i)_unzipped$' -and $_.FullName -ne $KeepZip })
    foreach ($oldZip in $oldZips) {
        $oldFolder = Join-Path $WatchFolder $oldZip.BaseName
        if ($oldFolder -eq $KeepFolder) { continue }
        try {
            if (Test-Path -LiteralPath $oldFolder) {
                $item = Get-Item -LiteralPath $oldFolder
                if (-not $item.PSIsContainer -or ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) {
                    Write-Warning "Skipping unusual extraction path: $oldFolder"
                    continue
                }
                Remove-ProcessedItem $oldFolder
            }
            Remove-ProcessedItem $oldZip.FullName
            Write-Host "Removed old version: $($oldZip.Name)" -ForegroundColor DarkGray
        } catch {
            Write-Warning "Could not remove $($oldZip.Name): $($_.Exception.Message)"
        }
    }
}

# Prevent two watchers from processing the same directory at once.
$hash = [Security.Cryptography.SHA256]::Create()
try { $id = [BitConverter]::ToString($hash.ComputeHash([Text.Encoding]::UTF8.GetBytes($WatchFolder.ToLowerInvariant()))) }
finally { $hash.Dispose() }
$mutex = New-Object Threading.Mutex($false, "Local\ZipFirefoxWatcher-$id")
$owned = $false
$seen = @{}
$done = @{}
try {
    try { $owned = $mutex.WaitOne(0) } catch [Threading.AbandonedMutexException] { $owned = $true }
    if (-not $owned) { throw 'Another watcher is already running for this folder.' }
    Write-Host "Watching: $WatchFolder" -ForegroundColor Cyan
    Write-Host 'Existing and new ZIP files will be processed. Close this window or press Ctrl+C to stop.'
    while ($true) {
        try { $files = @(Get-ChildItem -LiteralPath $WatchFolder -File -Filter '*.zip' | Sort-Object LastWriteTimeUtc, Name) }
        catch { Write-Warning $_.Exception.Message; Start-Sleep -Seconds 3; continue }
        foreach ($file in $files) {
            if ($file.BaseName -match '(?i)_unzipped$') { continue }
            $path = $file.FullName
            $signature = "$($file.Length):$($file.LastWriteTimeUtc.Ticks)"
            if ($done[$path] -eq $signature) { continue }
            if (-not $seen.ContainsKey($path) -or $seen[$path].Signature -ne $signature) {
                $seen[$path] = @{ Signature = $signature; Since = [DateTime]::UtcNow; Retry = [DateTime]::MinValue }
                continue
            }
            $state = $seen[$path]
            if (([DateTime]::UtcNow - $state.Since).TotalSeconds -lt 2 -or [DateTime]::UtcNow -lt $state.Retry) { continue }
            $stream = $null
            $archive = $null
            $temporary = $null
            try {
                # Exclusive read: do not extract a file that another process is writing.
                $stream = [IO.File]::Open($path, [IO.FileMode]::Open, [IO.FileAccess]::Read, [IO.FileShare]::None)
                $archive = [IO.Compression.ZipArchive]::new($stream, [IO.Compression.ZipArchiveMode]::Read, $true)
                $temporary = Join-Path $WatchFolder ('.zip-extract-' + [Guid]::NewGuid().ToString('N'))
                [void][IO.Directory]::CreateDirectory($temporary)
                $root = [IO.Path]::GetFullPath($temporary) + [IO.Path]::DirectorySeparatorChar
                # Validate every entry before extracting; reject paths outside the new folder.
                foreach ($entry in $archive.Entries) {
                    if ($entry.FullName.Contains(':')) { throw 'ZIP contains an unsupported filename.' }
                    $target = [IO.Path]::GetFullPath([IO.Path]::Combine($root, $entry.FullName))
                    if (-not $target.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
                        throw 'ZIP contains an unsafe extraction path.'
                    }
                }
                [IO.Compression.ZipFileExtensions]::ExtractToDirectory($archive, $temporary)
                $archive.Dispose(); $archive = $null
                $stream.Dispose(); $stream = $null
                $destination = Get-FreePath $file.BaseName '_unzipped' ''
                # Reserve a shared basename so ZIP and output remain an exact pair.
                $number = 2
                while (Test-Path -LiteralPath ($destination + '.zip')) {
                    $destination = Get-FreePath ($file.BaseName + "_$number") '_unzipped' ''
                    $number++
                }
                [IO.Directory]::Move($temporary, $destination)
                $temporary = $null
                # Prevent repeat extraction this session even if renaming is blocked.
                $done[$path] = $signature
                $renamedZip = $destination + '.zip'
                $renameSucceeded = $false
                try { [IO.File]::Move($path, $renamedZip); $renameSucceeded = $true }
                catch { Write-Warning "Extracted, but ZIP could not be renamed: $($_.Exception.Message). Rename it with _unzipped before restarting." }
                Write-Host "Extracted: $destination" -ForegroundColor Green
                $indexes = @(Get-ChildItem -LiteralPath $destination -Recurse -File |
                    Where-Object { $_.Name -in @('index.html', 'index.htm') -and $_.FullName -notmatch '[\\/](__MACOSX|node_modules|\.git)[\\/]' } |
                    Sort-Object @{Expression={ ($_.FullName.Substring($destination.Length) -split '[\\/]').Count }}, @{Expression={ if ($_.Name -ieq 'index.html') { 0 } else { 1 } }}, FullName)
                if ($indexes.Count -eq 0) {
                    Write-Warning 'Extracted successfully, but no index.html or index.htm was found.'
                } else {
                    if ($indexes.Count -gt 1) { Write-Host 'Multiple index files found; opening the one closest to the extraction root.' }
                    $uri = [Uri]::new($indexes[0].FullName).AbsoluteUri
                    Close-FirefoxWindows
                    if ($renameSucceeded) {
                        Remove-OldProcessedZips $renamedZip $destination
                    } else {
                        Write-Warning 'Keeping previous versions because the new ZIP could not be marked as processed.'
                    }
                    # Private window avoids restoring the previous normal browsing session.
                    Start-Process -FilePath $FirefoxPath -ArgumentList @('-private-window', ('"' + $uri + '"'))
                    Write-Host "Opened: $($indexes[0].FullName)"
                }
            } catch {
                $state.Retry = [DateTime]::UtcNow.AddSeconds(15)
                Write-Warning "$($file.Name): $($_.Exception.Message)"
            } finally {
                if ($archive) { $archive.Dispose() }
                if ($stream) { $stream.Dispose() }
                if ($temporary -and [IO.Directory]::Exists($temporary)) {
                    Remove-Item -LiteralPath $temporary -Recurse -Force -ErrorAction SilentlyContinue
                }
            }
        }
        Start-Sleep -Milliseconds 500
    }
} finally {
    if ($owned) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
