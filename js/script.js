// menu
const leftMenu = document.querySelector('.left-menu'),
    humburger = document.querySelector('.humburger'),
    tvShowsList = document.querySelector('.tv-shows__list');

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

// Read data from json file
const getShowsData = async (url) => {
    const response =  await fetch(url);
    if (!response.ok) {
        throw new Error(`Error response at ${url}, status: ${response.status}`);
    }
    return response.json();
};
// Insert TV show card data to HTML block
const tvShowCardCreate = ({id, head, vote, face, backdrop}) => {
    const card = `
    <li class="tv-shows__item">
        <a href="#" class="tv-card">
            <span class="tv-card__vote">${vote}</span>
            <img class="tv-card__img"
                src="${face}"
                data-backdrop="${backdrop}"
                alt="${head}">
            <h4 class="tv-card__head">${head}</h4>
        </a>
    </li>
    `;
    tvShowsList.insertAdjacentHTML('beforeend', card);
};

// Place TV show cards to main page
getShowsData('./data/tv-shows.json')
 .then((data) => {
    data.forEach(tvShowCardCreate);
});

// Toggel poster images at TV show card under mouse pointer
tvShowsList.addEventListener('mouseover', (event) => {
    const target = event.target;
    const img = target.closest('.tv-card__img');
    if (img != null) {
        localStorage.setItem('image', img['src']);
        img['src'] = img['dataset']['backdrop'];
    }
});
tvShowsList.addEventListener('mouseout', (event) => {
    const target = event.target;
    const img = target.closest('.tv-card__img');
    if (img != null) {
        img['src'] = localStorage.getItem('image');
    }
});
