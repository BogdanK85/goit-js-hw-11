import axios from "axios";
import { Notify } from "notiflix";

const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '38682022-bdf340dd8b2a78484bd235190'

const getImages = async (value, page) => {
    const { data } = await axios(BASE_URL, {
        params: {
            key: API_KEY,
            q: `${value}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: page,
            per_page: 40,
        }
    });
    return data;
}

export { getImages };