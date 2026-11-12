function validateForm() {
    var product = document.getElementById("product").value;
    sessionStorage.product = product;
   
    return result;
}

//Store individual product page into sessionStorage
function storeProduct(productName) {
    var options = ["Pen", "Pencils", "Eraser", "Rulers"];

    options.forEach(array);

    function array(value) {
        if (value == productName) {
            sessionStorage.productIndex = options.indexOf(value);
        }
    }
}

//Fill the subject field with the value of product
function storeSub() {
    document.getElementById("product").selectedIndex = sessionStorage.productIndex;

    var product = document.getElementById("product").value;

    sessionStorage.subject = product;
    document.getElementById("subject").value = sessionStorage.subject;
}

//Storing first optgroup into array

function productlist1() {
    var select = document.getElementById("product");

    var options = ["Pens", "Pencils", "Eraser", "Rulers"];

    for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

//change the value of the session storage according to the new product selected by user

function change() {
    var product = document.getElementById("product").value;
    sessionStorage.product = product;
    document.getElementById("subject").value = sessionStorage.product;
}