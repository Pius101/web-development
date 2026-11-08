
const galleryContainer = document.querySelector('.gallery-container');
const imageContainer = document.querySelector('.gallery-image-container');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

// Array of image URLs
const images = [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg',
  // Add more image URLs here
];

let currentImageIndex = 0;

// Function to display an image
function displayImage() {
  imageContainer.innerHTML = `<img src="${images[currentImageIndex]}" alt="Image ${currentImageIndex + 1}">`;
}

// Function to go to the next image
function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  displayImage();
}

// Function to go to the previous image
function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  displayImage();
}

// Event listeners for navigation buttons
nextButton.addEventListener('click', nextImage);
prevButton.addEventListener('click', prevImage);

// Initial display
displayImage();


function startHeroSlideshow() {
  const pictures = [
    "styles/images/plant1.jpg",
    "styles/images/plant2.jpg",
    "styles/images/plant3.jpg"
  ];

  const hero = document.getElementById("hero-image");

  if (!hero) {
    return;
  }

  let currentPicture = 0;

  // Display the first picture.
  hero.src = pictures[currentPicture];

  // Change the picture every 5 seconds.
  setInterval(function () {
    currentPicture = currentPicture + 1;

    // Return to the first picture after the last one.
    if (currentPicture >= pictures.length) {
      currentPicture = 0;
    }

    hero.src = pictures[currentPicture];
  }, 5000);
}

startHeroSlideshow();