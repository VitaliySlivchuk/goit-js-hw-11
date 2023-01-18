import FetchImagesApi from './fetchImages';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formEl: document.querySelector('#search-form'),
  inputEl: document.querySelector('input'),
  searchBtnEl: document.querySelector('[type=submit]'),
  galleryEl: document.querySelector('.gallery'),
  loadBtnEl: document.querySelector('.load-more'),
};

const simpleLightBox = new SimpleLightbox('.gallery a', {});

const fetchImagesApi = new FetchImagesApi();

refs.formEl.addEventListener('submit', onSubmit);
refs.loadBtnEl.addEventListener('click', onClick);

let totalHits = null;
let imageElements = null;
let arrHits = null;

hiddenBtn();

async function onSubmit(e) {
  e.preventDefault();
  clearMurkup();
  fetchImagesApi.resetPage();
  const inputFalue = e.currentTarget.elements.searchQuery.value.trim();

  fetchImagesApi.query = e.currentTarget.elements.searchQuery.value.trim();
  const respons = await fetchImagesApi.fetchImages();
  totalHits = respons.data.totalHits;
  arrHits = respons.data.hits;

  try {
    if (inputFalue) {
      fetchImagesApi.resetPage();
      createMurkup(arrHits);
      imageElements = refs.galleryEl.children.length;
      unHiddenBtn();
      simpleLightBox.refresh();
      fetchImagesApi.incrementPage();
      if (totalHits > 0) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    } else {
      Notify.warning('Type something');
    }
  } catch (error) {
    console.log(error);
  }
  if (imageElements === totalHits && arrHits.length) {
    hiddenBtn();
    Notify.info(`"We're sorry, but you've reached the end of search results.`);
  }
  isEmptyArrCheck(arrHits);
}

async function onClick() {
  const respons = await fetchImagesApi.fetchImages();
  try {
    totalHits = respons.data.totalHits;
    console.log(totalHits);
    arrHits = respons.data.hits;
    createMurkup(arrHits);
    imageElements = refs.galleryEl.children.length;
    unHiddenBtn();
    simpleLightBox.refresh();
  } catch (error) {
    console.log(error);
    hiddenBtn();
  }
  if (imageElements === totalHits) {
    hiddenBtn();
    Notify.info(`"We're sorry, but you've reached the end of search results.`);
  }
}

function createMurkup(arr) {
  try {
    refs.galleryEl.insertAdjacentHTML('beforeend', galleryMurkup(arr));
    // console.log(arr.length);
  } catch (error) {
    console.log(error);
  }
}

function galleryMurkup(arr) {
  const murkup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `

      <div class="photo-card">
        <a href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes: </b>${likes}</p>
              <p class="info-item"><b>Views: </b>${views}</p>
              <p class="info-item"><b>Comments: </b>${comments}</p>
              <p class="info-item"><b>Downloads: </b>${downloads}</p>
            </div>
          </a>
        </div>
          `;
      }
    )
    .join('');
  return murkup;
}

function clearMurkup() {
  refs.galleryEl.innerHTML = '';
}
function isEmptyArrCheck(arr) {
  if (!arr.length) {
    hiddenBtn();
    refs.inputEl.value = '';

    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
}

function hiddenBtn() {
  refs.loadBtnEl.classList.add('is-hidden');
}
function unHiddenBtn() {
  refs.loadBtnEl.classList.remove('is-hidden');
}
function endOfMurkup({ data }) {
  if (data.length > data.totalHits) {
    Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}
