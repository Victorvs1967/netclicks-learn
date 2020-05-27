// menu
const leftMenu = document.querySelector('.left-menu'),
    humburger = document.querySelector('.humburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

const BASE_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '565bffc33a642464d643ce0ca8704d54';
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
}

// Insert TV show card data to HTML block
const renderTvShowCard = ({id, original_name:title, vote_average:vote, poster_path:poster, backdrop_path:backdrop}) => {

    backdrop = (backdrop) ? BASE_URL + backdrop : './img/no-poster.jpg';
    poster = (poster) ? BASE_URL + poster : './img/no-poster.jpg';
    const span = (vote === 0) ? '' : `<span class="tv-card__vote">${vote}</span>`;

    const card = document.createElement('li');
    card.className = 'tv-shows__item'
    card.innerHTML = `
            <a href="#" class="tv-card" data-id="${id}">
                ${span}
                <img class="tv-card__img"
                    src="${poster}"
                    data-backdrop="${backdrop}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
    `;
    tvShowsList.append(card);
};

// Place TV show cards to main page
new DBService().getTestData()
 .then((data) => {
    data.results.forEach(renderTvShowCard);
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
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {
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


