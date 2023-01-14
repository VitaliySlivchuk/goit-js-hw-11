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
fetchImagesApi.fetchImages();

refs.formEl.addEventListener('submit', onSubmit);
refs.loadBtnEl.addEventListener('click', onClick);

hiddenBtn();

async function onSubmit(e) {
  e.preventDefault();
  clearMurkup();
  fetchImagesApi.resetPage();

  fetchImagesApi.query = e.currentTarget.elements.searchQuery.value;
  try {
    const respons = await fetchImagesApi.fetchImages();
    const arrHits = respons.data.hits;
    isEmptyArrCheck(arrHits);
    createMurkup(arrHits);
    simpleLightBox.refresh();
  } catch (error) {
    console.log(error);
  }
}

async function onClick() {
  try {
    const respons = await fetchImagesApi.fetchImages();
    const arrHits = respons.data.hits;
    createMurkup(arrHits);
    simpleLightBox.refresh();
  } catch (error) {
    console.log(error);
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
  unHiddenBtn();
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
