import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/?key=';
const API_KEY = '34316664-466e29a341a60f27537c73320';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function searchImages(searchQuery, page) {
  const url = `${BASE_URL}${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`;
  const response = await axios.get(url);
  return response.data;
}

function onSubmit(event) {
  event.preventDefault();
  const searchQuery = inputEl.value.trim();
  if (!searchQuery) {
    return;
  }
  page = 1;
  galleryEl.innerHTML = '';
  searchImages(searchQuery, page).then(data => {
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('hidden');
    } else {
      displayImages(data.hits);
      loadMoreBtn.classList.remove('hidden');

      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();

      if (data.totalHits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    }
  });
}

function onLoadMore() {
  page += 1;
  const searchQuery = inputEl.value.trim();
  searchImages(searchQuery, page).then(data => {
    if (data.hits.length === 0) {
      loadMoreBtn.classList.add('hidden');
    } else {
      displayImages(data.hits);

      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    }
  });
}

function displayImages(images) {
  const galleryHTML = images
    .map(
      image => `
        <div class="photo-card">
          <a href="${image.largeImageURL}" target="_blank">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${image.likes}</p>
            <p class="info-item"><b>Views:</b> ${image.views}</p>
            <p class="info-item"><b>Comments:</b> ${image.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </div>
      `
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', galleryHTML);
}
