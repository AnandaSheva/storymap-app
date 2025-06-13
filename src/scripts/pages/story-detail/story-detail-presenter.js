import { storyMapper } from '../../data/api-mapper';
export default class StoriesDetailPresenter {
  #storyId;
  #view;
  #apiModel;

  constructor(storyId, { view, apiModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoryDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);

      // console.log(response);

      if (!response.ok) {
        console.error('showStoryDetailAndMap: response:', response);
        this.#view.populateStoriesDetailError(response.message);
        return;
      }

      // console.log(response.story)

      const mappedStory = await storyMapper(response.story);


      // const story = await storyMapper(response.story);
      // console.log(story); // for debugging purpose, remove after checking it
      this.#view.populateStoriesDetailAndInitialMap(mappedStory);
    } catch (error) {
      console.error('showStoryDetailAndMap: error:', error);
      this.#view.populateStoriesDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  showSaveButton() {
    if (this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }

    this.#view.renderSaveButton();
  }

  #isStorySaved() {
    return false;
  }
}
