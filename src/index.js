const apiKey = 'YO40631901-ff7c1609fa7e5ab5e54020e9b';
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40, // You can adjust this value based on your needs
      },
    });

    if (response.data.hits.length === 0) {
      notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.innerHTML = ''; // Clear previous search results
      displayImages(response.data.hits);
      page = 1;
      showLoadMoreBtn();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again later.'
    );
  }
});

loadMoreBtn.addEventListener('click', async function () {
  const searchQuery = form.elements.searchQuery.value.trim();

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: ++page,
        per_page: 40,
      },
    });

    if (response.data.hits.length === 0) {
      hideLoadMoreBtn();
      notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      displayImages(response.data.hits);
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    notiflix.Notify.failure(
      'An error occurred while fetching more images. Please try again later.'
    );
  }
});

function displayImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}
