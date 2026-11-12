function showPwdWin() {
    var pwdHelpWin = document.getElementById("pwdHelpWin")
    var scrnOverlay = document.getElementById("scrnOverlay")
    pwdHelpWin.style.display = "block"
    scrnOverlay.style.visibility = "visible"

}
function hidePwdWin() {
    var pwdHelpWin = document.getElementById("pwdHelpWin")
    var scrnOverlay = document.getElementById("scrnOverlay")
    pwdHelpWin.style.display = "none"
    scrnOverlay.style.visibility = "hidden"
}
function init() {
    var pwdHelpBtn = document.getElementById("pwdHelpBtn")
    var pwdHelpClose = document.getElementById("pwdHelpClose")
    pwdHelpBtn.addEventListener("click", showPwdWin)
    pwdHelpClose.addEventListener("click", hidePwdWin)
}

window.addEventListener("load", init);