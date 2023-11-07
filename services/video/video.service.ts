import axiosClient from "../../helpers/apiClient";
import videoApiClient from "../../helpers/videoApiClient";

interface IVideoAudioTranslateTranscribe {
    uri: any,
    from_lang?: string,
    to_lang?: string,
    action?: string
}

class VideoApiSdk {
    async getFromLanguages() {
        return await axiosClient.post('/videos/from_languages/')
    }

    async getToLanguages() {
        return await axiosClient.post('/videos/to_languages/')
    }

    async getFromToLang() {
        return await axiosClient.post('/videos/languages/')
    }

    async getVideoAudioTranslationTranscription({ uri, from_lang = 'en-US', to_lang = 'fr', action = 'transcribe' }: IVideoAudioTranslateTranscribe) {
        return await videoApiClient.post(`/videos/?from_lang=${from_lang}&to_lang=${to_lang}&action=${action}`, uri)
    }

    async encodeSrt({ data, id,srt }: { data: any, id: string,srt:string }) {
        return await videoApiClient.patch(`/videos/${id}/`, data)

    }

    async getVideos({ page, page_size }: { page?: number | string , page_size?: number | string  }) {
      return await videoApiClient.get(`/videos/?page=${page}&page_size=${page_size}`)  
    }

}

const videoApiSdk = new VideoApiSdk()
export default videoApiSdk