const BASE_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

const leftMenu = document.querySelector('.left-menu'),
    humburger = document.querySelector('.humburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    firstAirDate = document.querySelector('.first-air-date'),
    originCountryList = document.querySelector('.origin-country-list'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    description = document.querySelector('.description'),
    rating = document.querySelector('.rating'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    loader = document.querySelector('.loader'),
    pagination = document.querySelector('.pagination'),
    dropdown = document.querySelectorAll('.dropdown');

const loading = document.createElement('div');
loading.className = 'loading';

let currentPage;
let firstPage;
let lastPage;
let pages;
class DBService {

    constructor() {
        this.API_KEY = '565bffc33a642464d643ce0ca8704d54';
        this.SERVER = `https://api.themoviedb.org/3`;    
    }
    
    async getData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error response at ${url}, status: ${response.status}`);
        }
        return response.json();
    }
    getSearchResult(query) {
        this.title = 'Результат поиска';
        tvShowsHead.textContent = this.title;
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=ru_RU`;
        return this.getData(this.temp);
    }
    getTopRatedTvShow() {
        this.title = 'Топ сериалов';
        tvShowsHead.textContent = this.title;
        this.temp = `${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru_RU`;
        return this.getData(this.temp);
    } 
    getPopularTvShow() {
        this.title = 'Популярные сериалы';
        tvShowsHead.textContent = this.title;
        this.temp = `${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru_RU`;
        return this.getData(this.temp);
    } 
    getWeekTvShow() {
        this.title = 'Эпизоды на этой неделе';
        tvShowsHead.textContent = this.title;
        this.temp = `${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru_RU`;
        return this.getData(this.temp);
    } 
    getTodayTvShow() {
        this.title = 'Эпизоды сегодня';
        tvShowsHead.textContent = this.title;
        this.temp = `${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru_RU`;
        return this.getData(this.temp);
    } 
    getNextPage(page) {
        tvShowsHead.textContent = this.title;
        return this.getData(`${this.temp}&page=${page}`);
    }
    getTvShow(tvId) {
        return this.getData(`${this.SERVER}/tv/${tvId}?api_key=${this.API_KEY}&language=ru_RU`)
    } 
    // testing
    getTestData() {
        return this.getData('./data/test.json');
    } 
    getTestCard() {
        return this.getData('./data/card.json');
    }
}

// Insert TV show card data to HTML block
const renderPagination = () => {
    pagination.textContent = '';
    if (firstPage < 1) { firstPage = 1 };
    if (lastPage > 1) {
        if (firstPage > 1) {
            pagination.innerHTML += `<li><a href="#" class="pages"><</a></li>`;
            pagination.innerHTML += `<li><a href="#" class="pages">1</a></li>`;
            pagination.innerHTML += `<li><a href="#" class="pages">..</a></li>`;
        }
        pagination.style.display = 'flex';
        let pagesRange = ((firstPage + 9) <= lastPage) ? firstPage + 9 : lastPage;
        for (let i = firstPage; i <= pagesRange; i++) {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;    
        }
        if ((lastPage - firstPage) >= 10) {
            pagination.innerHTML += `<li><a href="#" class="pages">..</a></li>`;
            pagination.innerHTML += `<li><a href="#" class="pages">${pages}</a></li>`;
            pagination.innerHTML += `<li><a href="#" class="pages">></a></li>`;
        }
    }
};

const renderTvShowCards = response => {
    tvShowsList.textContent = '';
    if (response.results.length === 0) {
        tvShowsHead.textContent = 'По запросу ничего не найдено...';
        tvShowsHead.style.cssText = 'color: red; border: 3px red';
        loading.remove();
        return;
    }
    tvShowsHead.style.cssText = '';

    pages = response.total_pages;
    lastPage = pages;
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
    renderPagination();
};

pagination.onclick = event => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('pages')) {
        switch (target.textContent) {
            case '<': {
                firstPage -= 9;
                lastPage -= 9;
                renderPagination(firstPage, lastPage);
                break;
            }
            case '>': {
                firstPage += 9;
                lastPage += 9;
                renderPagination(firstPage, lastPage);
                break;                  
            }
            case '..': break;
            default: {
                tvShows.append(loading);
                dbService.getNextPage(target.textContent).then(renderTvShowCards);   
                if (target.textContent === `${pages}`) {
                    firstPage = (firstPage < 1) ? 1 : pages - 9;
                    lastPage = pages;
                    renderPagination();
                } 
                if (target.textContent === `1`) {
                    firstPage = 1;
                    lastPage = pages;
                    renderPagination();
                }
            }
        }
   }
};

// search tv shows
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        searchFormInput.value = '';
        tvShows.append(loading);
        dbService.getSearchResult(value).then(renderTvShowCards);
    }
});

// open/close menu
const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    });
};

humburger.addEventListener('click', event => {
    leftMenu.classList.toggle('openMenu');
    humburger.classList.toggle('open');
    closeDropdown();
});

document.body.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        humburger.classList.remove('open');
        closeDropdown();
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    const search = document.getElementById('search');

    if (search) {
        search.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        humburger.classList.add('open');

        search.onclick = () => {
            tvShowsHead.textContent = '';
            tvShowsList.textContent = '';
            pagination.textContent = '';
        };    
    }

    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        humburger.classList.add('open');

        const popular = document.getElementById('popular'),   
              topRated = document.getElementById('top-rated'),
              week = document.getElementById('week'),
              today = document.getElementById('today');

        topRated.onclick = () => {
            tvShows.append(loading);
            dbService.getTopRatedTvShow().then(renderTvShowCards);    
            renderPagination();
        };
        popular.onclick = () => {
            tvShows.append(loading);
            dbService.getPopularTvShow().then(renderTvShowCards);    
            renderPagination();
        };
        week.onclick = () => {
            tvShows.append(loading);
            dbService.getWeekTvShow().then(renderTvShowCards);    
        };
        today.onclick = () => {
            tvShows.append(loading);
            dbService.getTodayTvShow().then(renderTvShowCards);    
        };
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

searchForm.onclick = () => {
    tvShowsHead.textContent = '';
    tvShowsList.textContent = '';
    pagination.textContent = '';
}

// modal open
tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {

        loader.style.display = 'block';
        dbService.getTvShow(card.dataset.id)
        .then(data => {
            console.log('data: ', data);

            firstAirDate.textContent = data.first_air_date.split(['-'])[0];
            tvCardImg.src = data.poster_path ? BASE_URL + data.poster_path : './img/no-poster.jpg';
            modalTitle.textContent = data.name;
            rating.textContent = data.vote_average;
            description.textContent = data.overview;
            modalLink.href = data.homepage;

            originCountryList.textContent = '';
            for (const item of data.origin_country) {
                originCountryList.innerHTML += `<li>${item}</li>`;
            }
            genresList.textContent = '';
            for (const item of data.genres) {
                genresList.innerHTML += `<li>${item.name}</li>`;
            }
        })
        .then(() => {
            document.body.style.overflow = 'hidden';
            modal.classList.remove('hide');    
        })
        .finally(() => {
            loader.style.display = '';
        });
    }
});

// modal close
modal.addEventListener('click', event => {
    const target = event.target;

    if (target.closest('.cross') || target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});

// init application
const init = () => {
    firstPage = 1;
    dbService = new DBService();
    loader.style.display = 'block';
    dbService.getTopRatedTvShow().then(renderTvShowCards); 
    loader.style.display = '';
}

init();