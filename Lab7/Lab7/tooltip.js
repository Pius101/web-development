/* write functions that define the action for each event */
function myid(name){
return document.getElementById(name).value;
}
function myid(){

}

function showTip() {
	var sidTip = document.getElementById("sidTip"); 		//obtain access to the HTML tool tip element using id "sidTip" and link it a varialbe named sidTip
	if (sid.value === "") {
		
		sidTip.style.display = "none";  						//hide the HTML tool tip element sidTip by changing its CSS property "display" to "none"
	} else {
		sidTip.style.display = "inline";  						//display the HTML tool tip element sidTip bying change the value of its CSS property "display" to "inline"
	}
}

function hideTip() {  										//this function hides the tool tip
	var sidTip = document.getElementById("sidTip"); 		//obtain access to the HTML tool tip element using id "sidTip" and link it a varialbe named sidTip

	sidTip.style.display = "none";  						//hide the HTML tool tip element sidTip by changing its CSS property "display" to "none"
}

function myfunc() {											/* the init function links functions to appropriate events of corresponding HTML elements */
	sid = document.getElementById("sid");				/* create a variable named sid.get access to the HTML element by its id "sid" and link it to sid */

	sid.addEventListener("mouseover", showTip);				/* link function showTip to the onmouseover event of sid */
	sid.addEventListener("mouseout", hideTip);				/* link function hideTip to the onmouseout event of sid  */
}

window.onload = myfunc;						/* link function init to the onload event of the window so that function init will be called when the page is loaded */