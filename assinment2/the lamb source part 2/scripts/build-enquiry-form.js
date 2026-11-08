function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function makeInputField(settings) {
    const group = makeElement("div", "form-group");
    const label = makeElement("label", "", settings.label);
    const input = document.createElement("input");

    label.htmlFor = settings.id;
    input.id = settings.id;

    for (const [attribute, value] of Object.entries(settings.attributes)) {
        input.setAttribute(attribute, value);
    }

    group.appendChild(label);
    group.appendChild(input);

    return group;
}

function makeChoice(type, name, value, text, extraClass = "") {
    const label = makeElement(
        "label",
        "choice-option " + extraClass
    );

    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    input.setAttribute("aria-required", "true");

    const caption = makeElement("span", "", text);

    label.appendChild(input);
    label.appendChild(caption);

    return label;
}

function buildEnquiryForm() {
    const container = document.getElementById("form-container");

    if (!container) {
        return;
    }

    const form = makeElement("form", "enquiry-form");
    form.action = "enquiry.html";
    form.method = "get";
    form.noValidate = true;

    // Error message box.
    const errorBox = makeElement("div", "form-errors");
    errorBox.id = "form-errors";
    errorBox.setAttribute("role", "alert");
    errorBox.hidden = true;

    form.appendChild(errorBox);

    // ---------- Your details ----------

    const details = document.createElement("fieldset");
    details.appendChild(makeElement("legend", "", "Your details"));

    const fieldRows = [
        [
            {
                id: "first-name",
                label: "First name",
                attributes: {
                    type: "text",
                    name: "first_name",
                    autocomplete: "given-name",
                    placeholder: " ",
                    "aria-required": "true"
                }
            },
            {
                id: "last-name",
                label: "Last name",
                attributes: {
                    type: "text",
                    name: "last_name",
                    autocomplete: "family-name",
                    placeholder: " ",
                    "aria-required": "true"
                }
            }
        ],
        [
            {
                id: "email",
                label: "Email address",
                attributes: {
                    type: "text",
                    name: "email",
                    autocomplete: "email",
                    inputmode: "email",
                    placeholder: "name@example.com",
                    "aria-required": "true"
                }
            },
            {
                id: "phone",
                label: "Phone number",
                attributes: {
                    type: "text",
                    name: "phone",
                    autocomplete: "tel",
                    inputmode: "numeric",
                    placeholder: "0123456789",
                    "aria-required": "true"
                }
            }
        ]
    ];

    for (const fieldSettings of fieldRows) {
        const row = makeElement("div", "form-row two-column-row");

        for (const settings of fieldSettings) {
            row.appendChild(makeInputField(settings));
        }

        details.appendChild(row);
    }

    form.appendChild(details);

    // ---------- Your enquiry ----------

    const enquiry = document.createElement("fieldset");
    enquiry.appendChild(makeElement("legend", "", "Your enquiry"));

    enquiry.appendChild(makeInputField({
        id: "subject",
        label: "Subject",
        attributes: {
            type: "text",
            name: "subject",
            placeholder: " ",
            "aria-required": "true"
        }
    }));

    // Classification dropdown.
    const classificationGroup = makeElement("div", "form-group");

    const classificationLabel = makeElement(
        "label",
        "",
        "Plant classification area"
    );

    classificationLabel.htmlFor = "classification";

    const dropdown = document.createElement("select");
    dropdown.id = "classification";
    dropdown.name = "classification";
    dropdown.setAttribute("aria-required", "true");

    const placeholder = makeElement("option", "", "Select an area");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.defaultSelected = true;

    dropdown.appendChild(placeholder);

    const areas = [
        "Family",
        "Genus",
        "Species",
        "Identification",
        "Contribution",
        "Other"
    ];

    for (const area of areas) {
        const option = makeElement("option", "", area);
        option.value = area.toLowerCase();
        dropdown.appendChild(option);
    }

    classificationGroup.appendChild(classificationLabel);
    classificationGroup.appendChild(dropdown);
    enquiry.appendChild(classificationGroup);

    // Enquiry type radio buttons.
    const typeGroup = makeElement("div", "form-group");

    typeGroup.appendChild(
        makeElement("span", "form-label", "Type of enquiry")
    );

    const choices = makeElement("div", "choice-grid");
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-label", "Type of enquiry");

    const enquiryTypes = [
        { value: "plant-information", label: "Plant information" },
        { value: "identification", label: "Identification" },
        { value: "contribution", label: "Contribution" },
        { value: "other", label: "Other" }
    ];

    for (const type of enquiryTypes) {
        choices.appendChild(makeChoice(
            "radio",
            "enquiry_type",
            type.value,
            type.label
        ));
    }

    typeGroup.appendChild(choices);
    enquiry.appendChild(typeGroup);

    // Comments.
    const commentsGroup = makeElement("div", "form-group");
    const commentsLabel = makeElement("label", "", "Comments");
    commentsLabel.htmlFor = "comments";

    const comments = document.createElement("textarea");
    comments.id = "comments";
    comments.name = "comments";
    comments.cols = 50;
    comments.rows = 7;
    comments.setAttribute("aria-required", "true");
    comments.placeholder =
        "Describe your question in as much useful detail as possible.";

    commentsGroup.appendChild(commentsLabel);
    commentsGroup.appendChild(comments);
    enquiry.appendChild(commentsGroup);

    // Confirmation checkbox.
    const confirmationGroup = makeElement(
        "div",
        "form-group confirmation-group"
    );

    confirmationGroup.appendChild(makeChoice(
        "checkbox",
        "confirmation",
        "confirmed",
        "I confirm that the information entered above is correct.",
        "confirmation-option"
    ));

    enquiry.appendChild(confirmationGroup);
    form.appendChild(enquiry);

    // ---------- Buttons ----------

    const actions = makeElement("div", "form-actions");

    const buttons = [
        {
            type: "submit",
            label: "Submit Enquiry",
            className: "primary-button form-submit"
        },
        {
            type: "reset",
            label: "Reset Form",
            className: "reset-button"
        }
    ];

    for (const settings of buttons) {
        const button = makeElement(
            "button",
            settings.className,
            settings.label
        );

        button.type = settings.type;
        actions.appendChild(button);
    }

    form.appendChild(actions);

    // Display the completed form.
    container.replaceChildren(form);

    // Same-page transfer.
    const subject = form.querySelector("#subject");

    dropdown.addEventListener("change", function () {
        subject.value = "RE: Enquiry on " + dropdown.value;
    });
}

buildEnquiryForm();