import axios from 'axios';
import { Notify } from 'notiflix';

export default class FetchImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  options = {
    Headers: {
      Autorization: 'Bearer 32799595-4883f30010edd47462b21129f',
    },
  };

  async fetchImages() {
    const BASE_URL =
      'https://pixabay.com/api/?key=32799595-4883f30010edd47462b21129f';
    const optionsUrl =
      '&image_type=photo&orientation=horizontal&safesearch=true';
    const url = `${BASE_URL}&q=${this.searchQuery}${optionsUrl}&page=${this.page}&per_page=40`;
    try {
      const response = await axios.get(url);
      this.incrementPage();
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
