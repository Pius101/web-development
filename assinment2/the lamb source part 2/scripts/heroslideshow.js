function startHeroSlideshow() {
    const pictures = [
        "images/Anisoptera-scaphula.jpeg",
        "images/Nepenthes-rajah.jpeg",
        "images/Paphiopedilum-rothschildianum.jpeg",
        "images/Dipterocarpus-grandiflorus.jpg"
    ];

    const hero = document.getElementById("hero");
    const fade = document.getElementById("hero-fade");

    if (!hero || !fade) {
        return;
    }

    const credits = hero.querySelectorAll(".hero-image-credit");
    let currentPicture = 0;
    let changing = false;

    // Start downloading the pictures before they are needed.
    const images = pictures.map(function (path) {
        const image = new Image();
        image.src = path;
        return image;
    });

    function updateCredits() {
        credits.forEach(function (credit, index) {
            credit.hidden = index !== currentPicture;
        });
    }

    hero.style.backgroundImage = "url('" + pictures[0] + "')";
    updateCredits();

    setInterval(function () {
        if (changing) {
            return;
        }

        const nextPicture = (currentPicture + 1) % pictures.length;

        // Wait until the next image has loaded successfully.
        if (!images[nextPicture].complete ||
            images[nextPicture].naturalWidth === 0) {
            return;
        }

        changing = true;

        // Cover the hero with a copy of the current picture.
        fade.style.transition = "none";
        fade.style.backgroundImage =
            "url('" + pictures[currentPicture] + "')";
        fade.style.opacity = "1";

        // Put the next picture underneath.
        hero.style.backgroundImage =
            "url('" + pictures[nextPicture] + "')";

        // Commit the starting opacity before beginning the fade.
        void fade.offsetWidth;

        fade.style.transition = "";
        fade.style.opacity = "0";

        currentPicture = nextPicture;
        updateCredits();

        setTimeout(function () {
            changing = false;
        }, 1500);
    }, 5000);
}

startHeroSlideshow();