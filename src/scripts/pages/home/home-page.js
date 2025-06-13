import {
  generateLoaderAbsoluteTemplate,
  generateStoriesItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../templates';
import storyMapPresenter from './home-presenter';
import * as CityCareAPI from '../../data/api';
import Map from '../../utils/maps';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Kumpulan Cerita Serumu</h1>

        <div class="story-list__container">
          <div id="story-list"></div>
          <div id="story-list-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h2 class="section-title">Peta Cerita</h2>
        <div class="story-list__map__container">
          <div id="map" class="story-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new storyMapPresenter({
      view: this,
      model: CityCareAPI,
    });

    await this.#presenter.initialGalleryAndMap();
  }

  populateStoriesList(stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
       if (this.#map) {
      const coordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.description };
      this.#map.addMarker(coordinate, markerOptions, popupOptions);
    }
      return accumulator.concat(
        generateStoriesItemTemplate({
          ...story,
        }),
      );
    }, '');

    document.getElementById('story-list').innerHTML = `
      <div class="story-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById('story-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById('story-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showLoading() {
    document.getElementById('story-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('story-list-loading-container').innerHTML = '';
  }
}
