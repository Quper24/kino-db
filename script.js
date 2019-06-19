const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
function apiSearch(event) {
    event.preventDefault();
    const searchText = document.querySelector('.form-control').value,
        url = 'https://api.themoviedb.org/3/search/multi?api_key=4e61d32c7f8095da04f6550d8cc3dd94&language=ru&query=' + searchText;

    movie.innerHTML = 'Загрузка...';
    fetch(url)
        .then(function (response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText))
            }
            return response.json();
        })
        .then(function (output) {
            let inner = '';
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let dataInfo = '';
                if(item.media_type !== 'person') dataInfo = `dataID="${item.id}" dataType="${item.media_type}"`;

                let poster = item.poster_path ? urlPoster + item.poster_path : './img/noposter.png';

                inner += `
                    <div class="col-12 col-md-4 col-xl-3 item" ${dataInfo}>
                        <img src="${poster}" alt="${nameItem}" class="imgPoster">
                        <h5>${nameItem}</h5>
                    </div>
                `;
            });
            movie.innerHTML = inner;

            const media = movie.querySelectorAll('.item[dataID]');
            media.forEach(function(elem) {
                elem.style.cursor = 'pointer';
                elem.addEventListener('click', openFullInfo);
            })
        })
        .catch(function (error) {
            movie.innerHTML = 'Упс, что то пошло не так';
            console.log('error: ' + error)
        });

}

function openFullInfo(){
    console.log(this)
}

searchForm.addEventListener('submit', apiSearch);