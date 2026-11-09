


contibutor_grid = document.getElementById('contibutor-grid');
// Create an element and optionally give it a class.
function makeElement(tag, className,) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    return element;
}
user_info = [
    [
        ["community contributor", "this person"],
        ["home region ", "kuching, Sarawak"],
        ["contributions", 2],
        ["description", "this is my description"],
        ["pictures", "../images/species-dipterocarpus-grandiflorus-1.jpg"],

    ],
    [
        ["community contributor", "david nyamongo"],
        ["home region ", "kuching, Sarawak"],
        ["contributions", 2],
        ["description", "this is my description"],
        ["pictures", "../images/species-dipterocarpus-grandiflorus-1.jpg"],
    ]

]


//create the user cards 
function make_the_card() {
    for (let i = 0; i < user_info.length; i++) {
        let newcard = makeElement('a', 'contributor-person-card');
        newcard.href = "contributors/aisha-rahman.html";

        let spanning = makeElement('span', 'contributor-person-label');
        spanning.innerText = user_info[i][0][0];
        newcard.appendChild(spanning);

        let user_name = makeElement('h3');
        user_name.innerText = user_info[i][0][1];
        newcard.appendChild(user_name);

        let dl = makeElement('dl', 'contributor-person-details');

        newcard.appendChild(dl);

        let region = makeElement('div');
        dl.appendChild(region);

        let home_region = makeElement('dt');
        home_region.innerText = user_info[i][1][0];
        region.appendChild(home_region);


        let region_name = makeElement('dd');
        var text = document.createTextNode(user_info[i][1][1]);
        region_name.appendChild(text)
        //region_name.innerText = user_info[1][1];
        region.appendChild(region_name);

        let contribution_div = makeElement('div');
        dl.appendChild(contribution_div);

        let contribution = makeElement('dt');
        contribution.innerText = user_info[i][2][0];
        contribution_div.appendChild(contribution);


        let no_of_contributions = makeElement('dd');
        no_of_contributions.innerText = user_info[i][2][1];
        contribution_div.appendChild(no_of_contributions);


        contibutor_grid.appendChild(newcard);
    }
}
make_the_card()
