ZIP -> EXTRACT -> CLOSE FIREFOX -> CLEAN UP -> OPEN NEW INDEX

SETUP (Windows PowerShell 5.1 or newer)
1. Close the old watcher window.
2. Extract this package and replace your previous watcher files.
3. Double-click Start-Watcher.cmd and choose the folder to watch.
4. Leave the watcher window running. Ctrl+C or closing it stops the watcher.

REMEMBERING YOUR FOLDER
The first selection is saved automatically as WatcherSettings.json beside
Watch-Zips.ps1. Future runs of Start-Watcher.cmd reuse it without asking.
Keep the scripts in a writable folder, such as a folder under Documents.
The settings file is created when you run the script; it is not in this ZIP.

To change the folder, stop the watcher and double-click Change-Folder.cmd.
This saves the new selection and starts watching it immediately. Cancelling
the picker leaves your previous saved setting unchanged.
You can also delete WatcherSettings.json to choose again on the next launch.
If the saved folder is missing or settings are invalid, the picker opens again.
An explicit WatchFolder parameter (or a nonempty default edited in the script)
takes precedence over the saved value; ChooseFolder overrides both.

For each ready ZIP, the watcher:
- Extracts it and searches recursively for index.html or index.htm.
- Renames it to website_unzipped.zip; output is website_unzipped.
- Asks ALL Firefox windows in your Windows session to close, including personal
  browsing windows, and waits for Firefox processes to exit. This closes their
  tabs too. Confirm any browser close-tabs/unsaved-form prompt. Nothing is
  force-killed. If Firefox remains in the background, exit it manually.
- Removes previous *_unzipped.zip files and exact matching extraction folders.
- Opens the new index in a private Firefox window to avoid restoring old tabs.
  Private-window cookies and login state differ from normal Firefox windows.

CLEANUP ERROR FIX
Uses the Windows shell directly, replacing the VisualBasic DeleteDirectory
call that reported "The system call level is not correct".
If recycling fails, old items are moved out of the watched folder to:
    %LOCALAPPDATA%\ZipFirefoxWatcher\Recovery
Paste that path into File Explorer to recover or manually delete them later.
Recovery copies consume disk space until you delete them. No permanent-delete
fallback is issued by this script. Use a local disk with a working Recycle Bin
for normal recycling. The Windows shell determines drive recycling support.
If both recycle and recovery fail, the item stays and a warning is printed.
The new page still opens; cleanup is attempted on the next successful new ZIP.

Only marked *_unzipped.zip files and folders with the identical basename are
cleaned up. This includes pairs produced by the previous version. Unmarked ZIPs
and unrelated folders stay. A marked ZIP whose folder is missing is also removed.
Use a dedicated website ZIP folder. Existing ZIPs are processed at startup,
oldest modification time first. ZIPs already ending in _unzipped are skipped.
The new ZIP and its output are always excluded from that pass's cleanup.

Extraction failures or missing index files leave previous versions untouched.
Firefox is closed only after an index has been found. Cleanup precedes launching
Firefox, so a launch failure can leave the older version in Recycle Bin/recovery;
the new extracted files remain and can be opened manually.

OPTIONAL SETTINGS (edit Watch-Zips.ps1 in Notepad)
Set the WatchFolder parameter near the top to skip the folder picker:
    [string]$WatchFolder = 'E:\Website ZIPs'
Set FirefoxPath only if automatic detection fails:
    [string]$FirefoxPath = 'D:\Firefox\firefox.exe'
If you previously customized these settings, copy them into the replacement.

The folder is checked every half second. ZIPs must remain unchanged for about
2 seconds and permit exclusive reading before extraction starts. Locked or
incomplete ZIPs are retried every 15 seconds. Password-protected ZIPs are not
supported. Monitoring is top-level; index searching within each ZIP is recursive.
Multiple indexes: shallowest first, index.html preferred over index.htm, then
alphabetical path. Output name collisions receive numbers. Nothing is overwritten.

No Python, extra packages, or administrator rights required. The launcher sets
execution policy for its process only. Pages open as local files; projects that
need a server or build step still require that setup.

Validation: package integrity and code paths reviewed in Linux. Windows shell
recycling and Firefox integration must be confirmed on your Windows computer.
Native shell reference:
https://learn.microsoft.com/en-us/windows/win32/api/shellapi/nf-shellapi-shfileoperationw
