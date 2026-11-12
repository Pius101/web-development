contibutor_grid = document.getElementById('contibutor-grid');
// Create an element and optionally give it a class.
function makeElement(tag, className, textinput) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (textinput) {
        element.innerText = textinput;
    }
    return element;
}

function handleClick(event) {
    //need to figure out which user am i over
    //need to single out that user data 
    //need to transfer the data 
    data = event.currentTarget.myparam;
    clicked_button_id = event.currentTarget.id
    data.forEach(user => {
        if (user.id == clicked_button_id) {
            console.log(user)
            sessionStorage.clicked_user = JSON.stringify(user)
            window.location.href = "user.html"
        }
    })



}

//create the user cards 
function make_the_card(data) {
    data.forEach(user => {
        let newcard = makeElement('button', 'contributor-person-card');
        newcard.addEventListener("click", handleClick);
        newcard.myparam = data
        newcard.id = user.id;


        let spanning = makeElement('span', 'contributor-person-label');

        spanning.innerText = "community contributor";
        newcard.appendChild(spanning);

        let user_name = makeElement('h3');
        user_name.innerText = user.community_contributor;
        newcard.appendChild(user_name);

        let dl = makeElement('dl', 'contributor-person-details');
        newcard.appendChild(dl);

        let region = makeElement('div');
        dl.appendChild(region);

        let home_region = makeElement('dt');
        home_region.innerText = "home region";
        region.appendChild(home_region);


        let region_name = makeElement('dd');
        //var text = document.createTextNode(user.home_region);
        //region_name.appendChild(text)
        region_name.innerText = user.home_region;
        region.appendChild(region_name);

        let contribution_div = makeElement('div');
        dl.appendChild(contribution_div);

        let contribution = makeElement('dt');
        contribution.innerText = "contributions";
        contribution_div.appendChild(contribution);


        let no_of_contributions = makeElement('dd');
        no_of_contributions.innerText = user.contributions.length;
        contribution_div.appendChild(no_of_contributions);

        let description = makeElement('p');
        description.innerText = user.description;
        newcard.appendChild(description);

        contibutor_grid.appendChild(newcard);

    });
}
async function getdata() {
    try {
        // Fetch the JSON file  
        const response = await fetch('users.json');

        // Check for HTTP errors  
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse JSON data  
        const data = await response.json();

        // Work with the data  
        console.log("Parsed JSON data (async/await):", data);
        make_the_card(data)
        return data;


    } catch (error) {
        // Handle errors  
        console.error("Failed to fetch data:", error);

    }
}

getdata()