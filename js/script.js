// menu
const leftMenu = document.querySelector('.left-menu'),
    humburger = document.querySelector('.humburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

const BASE_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
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
const renderTvShowCard = ({id, original_name, vote_average, poster_path, backdrop_path}) => {

    if (backdrop_path) {
        backdrop_path = BASE_URL + backdrop_path;
    } else {
        backdrop_path = './img/no-poster.jpg';
    }
    if (poster_path) {
        poster_path = BASE_URL + poster_path;
    } else {
        poster_path = './img/no-poster.jpg';
    }


    const card = document.createElement('li');
    card.className = 'tv-shows__item'
    card.innerHTML = `
            <a href="#" class="tv-card">
                <span class="tv-card__vote">${vote_average}</span>
                <img class="tv-card__img"
                    src="${poster_path}"
                    data-backdrop="${backdrop_path}"
                    alt="${original_name}">
                <h4 class="tv-card__head">${original_name}</h4>
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


