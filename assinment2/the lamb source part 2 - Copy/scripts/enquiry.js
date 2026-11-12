function storePlant(plantName) {
    sessionStorage.setItem("enquiryPlant", plantName);//why a key is needed to store the value in session storage
}
function fillSubject() {
    const subjectInput = document.getElementById("subject");
    const plantName = sessionStorage.getItem("enquiryPlant");

    if (subjectInput && plantName) {
        subjectInput.value = "RE: Enquiry on " + plantName;
        document.getElementById("enquiry-form-title").scrollIntoView({ behavior: 'smooth', block: "start" });
    }
}

fillSubject();//this works with defer but i would prefer to use the below method to ensure that the DOM is fully loaded before executing the function
//window.onload = fillSubject; both works but the below is more modern and preferred
window.addEventListener("load", fillSubject);
