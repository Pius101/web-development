
//make it so that when the user refreshes the page the number of contributions updates too 

const contributor_container_div = document.getElementById('contributor-hero-id');
const profile_contribution_list_div = document.getElementById('profile-contribution-list-id')
const contributor_profile = document.getElementById('contributor-profile-heading-id')

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

        return data;


    } catch (error) {
        // Handle errors  
        console.error("Failed to fetch data:", error);

    }
}

function make_user_webpage() {

    user_data = JSON.parse(sessionStorage.clicked_user)


    contribution_hero(user_data)
    contributions_title(user_data)
    console.log(user_data)
    make_contribution(user_data)



}
function contribution_hero(user_data) {
    const contributor_container_p = makeElement('p', 'eyebrow', "Community contributor");
    contributor_container_div.appendChild(contributor_container_p);

    let contributor_container_h1 = makeElement('h1', null, user_data.community_contributor)
    //contributor_container_h1.insertAdjacentElement("afterend", document.getElementsByClassName("eyebrow"))
    contributor_container_div.appendChild(contributor_container_h1);

    let contributor_container_p2 = makeElement('p', 'contributor-profile-location', user_data.home_region);
    contributor_container_div.appendChild(contributor_container_p2);

    let contributor_container_p3 = makeElement('p', 'contributor-lead', user_data.description);
    contributor_container_div.appendChild(contributor_container_p3);

    const contributor_container_a = makeElement('a', 'secondary-button contributor-back-link', " ← Back to contributors")
    contributor_container_a.href = "../contributor.html"
    contributor_container_div.appendChild(contributor_container_a);
}
function contributions_title(user_data) {
    const contributor_profile_div = makeElement('div')
    const contributor_profile_p = makeElement('p', null, "Submitted observations")

    const contribution_count = user_data.contributions.length + " contributions by " + user_data.community_contributor
    const contributor_profile_h2 = makeElement('h2', null, contribution_count)

    contributor_profile.appendChild(contributor_profile_div)
    contributor_profile_div.append(contributor_profile_p, contributor_profile_h2)

}

function make_contribution(contributor) {

    const contribution_artical = makeElement('artical', 'profile-contribution', null)
    contribution_artical.id = "contribution-" + contributor.id
    console.log(contributor)
    const contributor_contributions = contributor.contributions
    console.log(contributor_contributions)
    contributor_contributions.forEach(contribution => {
        console.log(contribution)
        contribution_figure(contribution_artical, contribution)
        contribution_info(contribution_artical, contributor.community_contributor, contribution)
    });

    profile_contribution_list_div.appendChild(contribution_artical)
}

function contribution_info(contribution_artical, community_contributor, contribution) {


    const contribution_div = makeElement('div', 'profile-contribution-body')
    const contribution_p_text = "Plant observation #" + contribution.id//this is a list change it 
    const contribution_p = makeElement('p', 'contribution-label', contribution_p_text)
    contribution_div.appendChild(contribution_p)

    const em = makeElement('em', null, contribution.plant_name)
    const contribution_h2 = makeElement('h2')
    contribution_h2.appendChild(em)
    contribution_div.appendChild(contribution_h2)

    const contribution_dl = makeElement('dl', "contribution-details")
    const dl_dt1 = makeElement('dt', null, "Contributor")
    const dl_dd1 = makeElement('dd', null, community_contributor)
    const dl_dt2 = makeElement('dt', null, "Location")
    const dl_dd2 = makeElement('dd', null, contribution.location)
    const dl_dt3 = makeElement('dt', null, "Contributor comment")
    const dl_dd3 = makeElement('dd', null, contribution.contributor_comment)
    contribution_dl.append(dl_dt1, dl_dd1, dl_dt2, dl_dd2, dl_dt3, dl_dd3);


    const contribution_details = makeElement('details', 'community-comments');
    contribution_details.open = "";
    const contribution_details_summary_text = contribution.community_comments.length + " community comments"
    const contribution_details_summary = makeElement('summary', null, contribution_details_summary_text)

    const contribution_ul = makeElement('ul', 'comment-list')
    const there_comments = contribution.community_comments
    contribution.community_comments.forEach(comments => {
        console.log(comments)
        const contribution_li = makeElement('li')
        const li_strong = makeElement('strong', null, comments.commentor_name)
        const li_p = makeElement('p', null, comments.comment)
        contribution_li.appendChild(li_strong)
        contribution_li.appendChild(li_p)
        contribution_ul.appendChild(contribution_li)
    });
    contribution_details.append(contribution_ul, contribution_details_summary)
    contribution_div.appendChild(contribution_dl)
    contribution_div.appendChild(contribution_details)
    contribution_artical.appendChild(contribution_div)

}

function contribution_figure(contribution_artical, contribution) {

    //figure bussiness 
    const figure = makeElement('figure', 'profile-contribution-figure')

    const image = makeElement('img');
    console.log(contribution.picture.location);
    image.alt = contribution.picture.alt;
    image.src = contribution.picture.location;
    const fig_caption = makeElement('figcaption', null, contribution.plant_name)
    const figure_a = makeElement('a', null, contribution.picture.caption)
    figure_a.href = contribution.picture.refrence
    fig_caption.appendChild(figure_a);

    figure.appendChild(image);
    figure.appendChild(fig_caption);
    contribution_artical.appendChild(figure)
}


make_user_webpage()
