import axios from "axios";
import { Notify } from "notiflix";
import { getImages } from "./pixabay-api";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formElem = document.querySelector('#search-form');
const inputElem = formElem.firstElementChild;
const searchBtn = formElem.lastElementChild;
const galleryList = document.querySelector('.gallery-list');
const loadMoreBtn = document.querySelector('.load-more');
const imgPerPage = 40;
let query = "";
let currentPage = 1;
let totalPages = null;

inputElem.addEventListener('focus', onInputFocus)
loadMoreBtn.classList.add('is-hidden');
searchBtn.disabled = true;

function onInputFocus() {
    formElem.addEventListener('submit', onSearchSubmit);
    searchBtn.disabled = false;
}

async function onSearchSubmit(event) {
    event.preventDefault();
    onInputFocus()
    loadMoreBtn.classList.add('is-hidden');

    galleryList.innerHTML = ""
    currentPage = 1;
    const { searchQuery } = event.currentTarget.elements;
    query = searchQuery.value.trim();

    if (event.type === 'submit') {
        loadMoreBtn.classList.add('is-hidden')
        try {
            const getImgForPhotos = await getImages(query);
            const { hits, totalHits } = getImgForPhotos;

            if (!hits.length) {
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            }

            Notify.success(`Hooray! We found${totalHits} images`);

            galleryList.insertAdjacentHTML('beforeend', createPictureMarkup(hits));

            initializeLightbox();
            
            totalPages = Math.ceil(totalHits / imgPerPage);

            if (currentPage < totalPages) {
                loadMoreBtn.classList.remove('is-hidden');
                loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
            }
        }
        catch (error) {
            Notify.info("We're sorry, but you've reached the end of search results.")
            console.log(error);
        }
    }
}

async function onLoadMoreBtnClick() {
    currentPage += 1;
    try {
        const { hits } = await getImages(query, currentPage);

        galleryList.insertAdjacentHTML('beforeend', createPictureMarkup(hits));

        initializeLightbox();
        //pictureGalleryScroll();

        if (currentPage === totalPages) {
            Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.classList.add('id-hidden');
        }
    }
    catch (error) {
        Notify.failure(error.message);
    }
}

function createPictureMarkup(hits) {
    return hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a href="${largeImageURL}" class="lightbox-current">
        <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b>Likes ${likes}</b>
                </p>
                <p class="info-item">
                <b>Views ${views}</b>
                </p>
                <p class="info-item">
                <b>Comments ${comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads ${downloads}</b>
                </p>
            </div>
        </div>
        </a>`
    }).join("");
}

function initializeLightbox() {
    const lightbox = new SimpleLightbox('.gallery-list a', {
        captionsData: 'alt',
        captionDelay: 250,
    });
    lightbox.refresh();
}

// function pictureGalleryScroll() {
//     const 
// }