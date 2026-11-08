function setupEnquiryValidation() {
    const form = document.querySelector(".enquiry-form");

    if (!form) {
        return;
    }

    const errorBox = form.querySelector("#form-errors");

    if (!errorBox) {
        return;
    }

    form.noValidate = true;

    form.addEventListener("submit", function (event) {
        const errors = [];

        // Clear the previous error message.
        errorBox.hidden = true;
        errorBox.textContent = "";

        // Read the current form values.
        const fields = form.elements;

        const firstName = fields.namedItem("first_name").value.trim();
        const lastName = fields.namedItem("last_name").value.trim();
        const email = fields.namedItem("email").value.trim();
        const phone = fields.namedItem("phone").value.trim();
        const subject = fields.namedItem("subject").value.trim();
        const classification = fields.namedItem("classification").value;
        const comments = fields.namedItem("comments").value.trim();

        // Radio buttons with the same name form a group.
        // Its value is the selected option, or "" if none is selected.
        const enquiryType = fields.namedItem("enquiry_type").value;

        const confirmation = fields.namedItem("confirmation").checked;

        // First name.
        if (firstName === "") {
            errors.push("First name is required.");
        } else {
            if (!/^[A-Za-z ]+$/.test(firstName)) {
                errors.push("First name must contain letters and spaces only.");
            }

            if (firstName.length > 25) {
                errors.push("First name must not exceed 25 characters.");
            }
        }

        // Last name.
        if (lastName === "") {
            errors.push("Last name is required.");
        } else {
            if (!/^[A-Za-z ]+$/.test(lastName)) {
                errors.push("Last name must contain letters and spaces only.");
            }

            if (lastName.length > 25) {
                errors.push("Last name must not exceed 25 characters.");
            }
        }

        // Email address.
        if (email === "") {
            errors.push("Email address is required.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Enter a valid email address.");
        }

        // Phone number.
        if (phone === "") {
            errors.push("Phone number is required.");
        } else if (!/^[0-9]{1,10}$/.test(phone)) {
            errors.push("Phone number must contain 1–10 digits only.");
        }

        // Subject.
        if (subject === "") {
            errors.push("Subject is required.");
        }

        // Classification dropdown.
        if (classification === "") {
            errors.push("Select a plant classification area.");
        }

        // Enquiry type.
        if (!enquiryType) {
            errors.push("Select a type of enquiry.");
        }

        // Comments.
        if (comments === "") {
            errors.push("Comments are required.");
        }

        // Confirmation.
        if (!confirmation) {
            errors.push("Confirm that the information entered is correct.");
        }

        // Prevent submission if any checks failed.
        if (errors.length > 0) {
            event.preventDefault();

            alert(
                "Please correct the following:\n\n" + errors.join("\n")
            );
        }

        /*if (errors.length > 0) {
            event.preventDefault();

            const dialog = document.getElementById("error-dialog");
            const message = document.getElementById("error-message");

            message.textContent = errors.join("\n");
            dialog.showModal();
        }*/
    });

    // Clear the error message when the form is reset.
    form.addEventListener("reset", function () {
        errorBox.hidden = true;
        errorBox.textContent = "";
    });
}

setupEnquiryValidation();