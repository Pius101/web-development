let errorMessages = [];

function formvalues() {
    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const birthday = document.getElementById('birthday').value.trim();
    const drop = document.getElementById('tutor').value.trim();
    const textinput = document.getElementById('description').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    if (username === "") {
        errorMessages.push("Name cannot be empty")
    }
    else {
        if (!/^[A-Za-z ]+$/.test(username)) {
            errorMessages.push("Name must contain letters and spaces only.");
        }

        if (username.length > 25) {
            errorMessages.push("Name must not exceed 25 characters.");
        }
    }
    if (birthday === "") {
        errorMessages.push("birthday cannot be empty")
    }

    if (email === "") {
        errorMessages.push("Email cannot be empty")
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessages.push("Enter a valid email address.");
    }

    if (drop === "none") {
        errorMessages.push("tutor have to be selected")
    }
    if (textinput === "") {
        errorMessages.push("Description cannot be empty")
    }
    if (date === "") {
        errorMessages.push("Date cannot be empty")
    }
    if (time === "") {
        errorMessages.push("Time cannot be empty")
    }


}
function displayRadioValue() {
    const ele = document.getElementsByName("unit");

    let selected = false;

    for (let i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            selected = true;
            break;
        }
    }

    if (!selected) {
        errorMessages.push("Please select a unit.");
    }
}


function selectedcheckbox() {
    //document.getElementById("result").innerHTML = "";
    const checkboxes = document.getElementById('issues').getElementsByTagName('input');
    const selectedValues = [];

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].type === "checkbox" && checkboxes[i].checked) {
            selectedValues.push(checkboxes[i].value);

        }

    }
    if (selectedValues.length === 0) {
        errorMessages.push("please select an issue")
    }
    //document.getElementById("result").innerHTML += selectedValues.join(", ");
}


function validateForm() {

    // Clear previous error messages
    errorMessages.length = 0;


    formvalues();
    displayRadioValue();
    selectedcheckbox();


    if (errorMessages.length > 0) {
        alert(errorMessages.join("\n"));
        return false;
    }
    else {
        return true;
    }
}
function init() {
    const form = document.getElementById("detail");

    form.onsubmit = validateForm;
}

window.addEventListener("load", init);