
function storeitem(item_id) {
    sessionStorage.setItem("item_id", item_id);
    window.location.replace("enquiry.html");
}
function displayitem() {
    document.getElementById("sbj").value = "RE: Enquiry on " + sessionStorage.getItem("item_id");
}


function initalise() {
    var formElement = document.getElementById("f");
    
    displayitem()
  
}

window.onload = initalise;