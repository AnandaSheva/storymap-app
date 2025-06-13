import { storeNewStory } from '../../data/api';

export default class NewPresenter {
    #view;
    #model;

    constructor({view, model}) {
        this.#view = view;
        this.#model = {
            storeNewStory, // ← ini penting
        };
    }

    async showNewFormMap() {
        this.#view.showMapLoading();
        try {
            await this.#view.initialMap();
        } catch (error) {
            console.error('showNewFormMap: error:', error);
        } finally {
            this.#view.hideMapLoading();
        }
    }

    async postNewStory({description, photoFile, lat, lon, isGuest = false}) {
        this.#view.showSubmitLoadingButton();

        try {
            // Konversi Blob ke File jika perlu
            let photo = photoFile;
            if (photo instanceof Blob && !(photo instanceof File)) {
                photo = new File([photo], 'photo.jpg', {type: photo.type || 'image/jpeg'});
            }

            // Validasi ukuran maksimum 1MB
            if (photo.size > 1024 * 1024) {
                this.#view.storeFailed('Ukuran foto maksimal 1MB');
                return;
            }

            // Panggil fungsi model sesuai mode login/guest
            const response = await this.#model.storeNewStory({
                description,
                photo: photoFile,
                latitude: lat,
                longitude: lon,
            });

            // Penanganan response
            if (!response.ok) {
                console.error('postNewStory: response:', response);
                this.#view.storeFailed(response.message || 'Gagal mengirim cerita');
                return;
            }

            this.#view.storeSuccessfully('Cerita berhasil dikirim');
        } catch (error) {
            console.error('postNewStory: error:', error);
            this.#view.storeFailed(error.message || 'Terjadi kesalahan saat mengirim data');
        } finally {
            this.#view.hideSubmitLoadingButton();
        }
    }
}