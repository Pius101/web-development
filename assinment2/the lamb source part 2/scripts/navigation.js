function buildNavigation() {
    const header = document.getElementById("responsive-navigation");

    if (!header) {
        return;
    }

    // Links shared by desktop and mobile navigation.
    const pages = [
        ["Identify", "identify.html"],
        ["Contributors", "contributor.html"],
        ["Contribute", "contribute.html"],
        ["Enquiry", "enquiry.html"],
        ["Profile", "profile.html"],
        ["Enhancements", "enhancement1.html"],
        ["Acknowledgement", "acknowledgement.html"]
    ];

    const categories = [
        ["Families", "families.html"],
        ["Genera", "genera.html"],
        ["Species", "species.html"]
    ];

    // Create an element and optionally give it a class.
    function makeElement(tag, className) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        return element;
    }

    // Create a list item containing a link.
    function makeLink(text, address, className) {
        const item = makeElement("li", className);
        const link = document.createElement("a");

        link.textContent = text;
        link.href = address;

        item.appendChild(link);

        return item;
    }

    // Navigation container.
    const nav = makeElement("nav", "navbar");
    nav.setAttribute("aria-label", "Main navigation");

    // Logo and website name.
    const logo = makeElement("a", "site-logo");
    logo.href = "index.html";
    logo.setAttribute(
        "aria-label",
        "Malaysia Plant Biodiversity home page"
    );

    const logoImage = document.createElement("img");
    logoImage.src = "styles/images/logo.svg";
    logoImage.alt = "Malaysia Plant Biodiversity logo";

    const logoText = document.createElement("span");
    logoText.textContent = "MY Plant Watch";

    logo.appendChild(logoImage);
    logo.appendChild(logoText);
    nav.appendChild(logo);

    // ---------- Desktop navigation ----------

    const desktopList = makeElement("ul", "nav-links desktop-nav");

    const exploreItem = makeLink("Explore ", "explore.html", "dropdown");

    const arrow = document.createElement("span");
    arrow.textContent = "\u25BE"; // Downward arrow.
    arrow.setAttribute("aria-hidden", "true");

    exploreItem.querySelector("a").appendChild(arrow);

    const dropdown = makeElement("ul", "dropdown-menu");

    for (const [text, address] of categories) {
        dropdown.appendChild(makeLink(text, address));
    }

    exploreItem.appendChild(dropdown);
    desktopList.appendChild(exploreItem);

    for (const [text, address] of pages) {
        desktopList.appendChild(makeLink(text, address));
    }

    nav.appendChild(desktopList);

    // ---------- Mobile navigation ----------

    const mobileMenu = makeElement("details", "mobile-nav");
    const hamburger = makeElement("summary", "hamburger");

    hamburger.setAttribute("aria-label", "Open navigation menu");

    // Three lines forming the hamburger icon.
    for (let line = 0; line < 3; line++) {
        hamburger.appendChild(document.createElement("span"));
    }

    mobileMenu.appendChild(hamburger);

    const mobileList = makeElement("ul", "mobile-nav-links");

    mobileList.appendChild(makeLink("Explore", "explore.html"));

    const categoryTitle = makeElement("li", "mobile-submenu-title");
    categoryTitle.textContent = "Explore categories";
    mobileList.appendChild(categoryTitle);

    for (const [text, address] of categories) {
        mobileList.appendChild(
            makeLink(text, address, "mobile-subitem")
        );
    }

    for (const [text, address] of pages) {
        mobileList.appendChild(makeLink(text, address));
    }

    mobileMenu.appendChild(mobileList);
    nav.appendChild(mobileMenu);

    // Update the menu's accessible label when opened or closed.
    mobileMenu.addEventListener("toggle", function () {
        hamburger.setAttribute(
            "aria-label",
            mobileMenu.open
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    });

    // Place the finished navigation inside the header.
    header.replaceChildren(nav);
}

buildNavigation();