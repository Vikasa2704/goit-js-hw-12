import { fetchImages } from './js/pixabay-api.js';
import {
  createMarkup,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  showLoadingIndicatorBtn,
  hideLoadingIndicatorBtn,
} from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import './css/styles.css';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  const gallery = document.querySelector('.gallery');
  const loaderContainer = document.querySelector('.loader-container');
  const loadMoreBtn = document.querySelector('.load-more');

  hideLoadMoreBtn(loadMoreBtn); // Спочатку приховуємо кнопку Load More
  hideLoader(loaderContainer); // Спочатку приховуємо індикатор завантаження

  let searchQuery = '';
  let page = 1;
  let totalHits = 0;

  form.addEventListener('submit', onSearch);
  loadMoreBtn.addEventListener('click', onLoadMore);

  function onSearch(event) {
    event.preventDefault();
    searchQuery = input.value.trim();
    page = 1; // Скидаємо номер сторінки до 1 при новому запиті
    clearGallery();
    showLoader(loaderContainer);
    hideLoadMoreBtn(loadMoreBtn);

    if (searchQuery === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query!',
      });
      input.value = '';
      hideLoader(loaderContainer);
      return;
    }

    fetchImages(searchQuery, page)
      .then(data => {
        if (data.hits && data.hits.length > 0) {
          const markup = createMarkup(data.hits);
          gallery.insertAdjacentHTML('beforeend', markup);

          const lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
          });
          lightbox.refresh();

          totalHits = data.totalHits;
          if (gallery.children.length < totalHits) {
            showLoadMoreBtn(loadMoreBtn);
          }
        } else {
          iziToast.error({
            title: 'Error',
            message: 'No images found!',
          });
        }
        input.value = '';
      })
      .catch(error => {
        iziToast.error({
          title: 'Error',
          message: error.message,
        });
        input.value = '';
      })
      .finally(() => hideLoader(loaderContainer));
  }

  function onLoadMore() {
    page += 1;
    showLoader(loaderContainer); // Показуємо індикатор завантаження під кнопкою

    fetchImages(searchQuery, page)
      .then(data => {
        if (data.hits && data.hits.length > 0) {
          const markup = createMarkup(data.hits);
          gallery.insertAdjacentHTML('beforeend', markup);

          const lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
          });
          lightbox.refresh();

          if (gallery.children.length >= totalHits) {
            hideLoadMoreBtn(loadMoreBtn);
            iziToast.info({
              title: 'Info',
              message:
                "We're sorry, but you've reached the end of search results.",
            });
          }

          // Плавне прокручування сторінки
          const { height: cardHeight } =
            gallery.firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
        } else {
          hideLoadMoreBtn(loadMoreBtn);
        }
      })
      .catch(error => {
        iziToast.error({
          title: 'Error',
          message: error.message,
        });
      })
      .finally(() => hideLoader(loaderContainer));
  }
});
