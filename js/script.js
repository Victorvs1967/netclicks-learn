const BASE_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '565bffc33a642464d643ce0ca8704d54';
const SERVER = `https://api.themoviedb.org/3/`;

const leftMenu = document.querySelector('.left-menu'),
    humburger = document.querySelector('.humburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    description = document.querySelector('.description'),
    rating = document.querySelector('.rating'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');

const loading = document.createElement('div');
loading.className = 'loading';
class DBService {

    async getData(url) {
        const response =  await fetch(url);
        if (!response.ok) {
            throw new Error(`Error response at ${url}, status: ${response.status}`);
        }
        return response.json();
    }

    async getTestData() {
        return await this.getData('./data/test.json');
    } 
    
    async getTestCard() {
        return await this.getData('./data/card.json');
    }

    async getSearchResult(query) {
        return await this.getData(`${SERVER}search/tv?api_key=${API_KEY}&query=${query}&page=1`);
    }

    async getTvShow(tvId) {
        return await this.getData(`${SERVER}tv/${tvId}?api_key=${API_KEY}&language=ru_RU`)
    } 

}

// Insert TV show card data to HTML block
const renderTvShowCard = response => {
    tvShowsList.textContent = '';

    response.results.forEach(item => {
        const { id,
                original_name: title,
                vote_average: vote,
                poster_path: poster,
                backdrop_path: backdrop
                } = item;

        const backdropImg = backdrop ? BASE_URL + backdrop : './img/no-poster.jpg';
        const posterImg = poster ? BASE_URL + poster : './img/no-poster.jpg';
        const span = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item'
        card.innerHTML = `
                <a href="#" class="tv-card" data-id="${id}">
                    ${span}
                    <img class="tv-card__img"
                        src="${posterImg}"
                        data-backdrop="${backdropImg}"
                        alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
        `;
        loading.remove();
        tvShowsList.append(card);
    });
};

{
    tvShows.append(loading);
    new DBService().getTestData().then(renderTvShowCard);
}

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value;
    new DBService().getSearchResult(value).then(renderTvShowCard);
    searchFormInput.value = '';
});

// open/close menu
humburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    humburger.classList.toggle('open');
});

document.body.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        humburger.classList.remove('open');
        }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        humburger.classList.add('open');
    }
});

// Toggel poster images at TV show card under mouse pointer
const toggleImg = event => {
    const target = event.target;
    const img = target.closest('.tv-card__img');
    if (img) {
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
};

tvShowsList.addEventListener('mouseover', toggleImg);
tvShowsList.addEventListener('mouseout', toggleImg);

tvShowsList.addEventListener('click', event => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {

        new DBService().getTvShow(card.dataset.id)
        .then(data => {
            tvCardImg.src = data.poster_path ? BASE_URL + data.poster_path : './img/no-poster.jpg';
            modalTitle.textContent = data.name;
            rating.textContent = data.vote_average;
            description.textContent = data.overview;
            modalLink.href = data.homepage;
        })
        .then(() => {

        });
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});

modal.addEventListener('click', event => {
    const target = event.target;

    if (target.closest('.cross') || target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});


