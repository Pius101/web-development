
/*get variables from form and check rules*/
function validate() {
    var errMsg = ""; /* stores the error message */
    var result = true; /* assumes no errors */
    if (result) {
        alert("Booking Successfully");
    } else {
        alert("Booking Failed");
    }
    return result; //if false the information will not be sent to the server
}
function getBooking() {
    //if sessionStorage for username is not empty

    if (sessionStorage.username != undefined) {
        //confirmation text
        console.log(sessionStorage.username)
        document.getElementById("confirm_name").textContent = sessionStorage.username;
        document.getElementById("confirm_email").textContent = sessionStorage.email;
        document.getElementById("confirm_birthday").textContent = sessionStorage.birthday;
        document.getElementById("confirm_unit").textContent = sessionStorage.selected_unit;
        document.getElementById("confirm_drop").textContent = sessionStorage.drop;
        document.getElementById("confirm_issue").textContent = sessionStorage.selectedValues;
        document.getElementById("confirm_textinput").textContent = sessionStorage.textinput;
        document.getElementById("confirm_date").textContent = sessionStorage.date;
        document.getElementById("confirm_time").textContent = sessionStorage.time;

    }
}
function cancelBooking() {
    window.location = "register.html";
}
function init() {
    //call the getBooking() function.
    getBooking();
    // link the variable to the HTML element
    var bookForm = document.getElementById("bookform");
    var cancelBooking = document.getElementById("cancelButton");
    //check which button is being click.
    if (bookForm) {
        bookForm.onsubmit = validate;
    } else {
        cancelBooking.onclick = cancelBooking();
    }
}
window.onload = init;