const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value,
        server = 'https://api.themoviedb.org/3/search/multi?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru&query=' + searchText;
    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
        return
    }
    movie.innerHTML = '<div class="spinner"></div>';
    fetch(server)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.statusText))
            }
            return value.json();
        })
        .then(function (output) {
            console.log(output.results);

            let inner = '<h4 class="col-12 text-center text-info">Результат поиска</h4>';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-danger">К сожалению, по вашему запросу ничего не найдено</h2>';
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let dataInfo = '';
                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;

                let poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';

                inner += `
                    <div class="col-12 col-md-4 col-xl-3 item" >
                        <img src="${poster}" alt="${nameItem}" class="imgPoster" ${dataInfo}>
                        <h5>${nameItem}</h5>
                    </div>
                `;
            });
            movie.innerHTML = inner;

            addEventMedia()
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что то пошло не так';
            console.error('error: ' + reason || reason.status);
        });

}

function openFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru'
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru'
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">Произошла ошибка повторите позже</h2>';
        return;
    }

    console.log(url) //пишем фетч

}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const imgElem = movie.querySelectorAll('.item>img[data-id]');
    imgElem.forEach(function (elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', openFullInfo);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru')
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.statusText))
            }
            return value.json();
        })
        .then(function (output) {
            let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h4>';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-danger">К сожалению, по вашему запросу ничего не найдено</h2>';
            }
            output.results.forEach(function (item) {
                const nameItem = item.name || item.title;
                const mediaType = item.title ? 'movie' : 'tv';
                const dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;

                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';

                inner += `
                    <div class="col-12 col-md-4 col-xl-3 item" >
                        <img src="${poster}" alt="${nameItem}" class="imgPoster" ${dataInfo}>
                        <h5>${nameItem}</h5>
                    </div>
                `;
            });
            movie.innerHTML = inner;

            addEventMedia()
        })
        .catch(function (reason) {
            movie.innerHTML = 'Упс, что то пошло не так';
            console.error('error: ' + reason || reason.status);
        });
});

