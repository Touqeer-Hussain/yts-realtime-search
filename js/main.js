const mApi = `https://yts.am/api/v2/list_movies.json`
const search = document.querySelector('#searchQuery');
const cate = document.getElementById('genreList');
const contents = document.querySelector('#mList');
const expand = document.querySelector('#more');

const aviGen = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentry', 'Drama', 'Family', 'Fantasy', 'Film Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Short', 'Sport', 'Superhero', 'Thirller', 'War', 'Western'
]

aviGen.map(g =>{
    var val = g.toLocaleLowerCase()
    document.getElementById('genreList').innerHTML += `<option value="${val}" >${g}</option>`
})



document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  });

async function home(){

    
    contents.innerHTML = ''
    
    if(cate.value !== ''){
        var req = await fetch(`${mApi}?query_term=${search.value}&genre=${cate.value}`)
    }else{
        var req = await fetch(`${mApi}?query_term=${search.value}`)
    }
    
    let list = await req.json()
    if(list.data.movie_count !== 0){
    list.data.movies.map((m, index) =>{
        contents.innerHTML += renderlist(m.title, m.description_full, m.rating, m.genres.join(', '), m.year, m.medium_cover_image, index)
        
    m.torrents.map(t =>{
        document.getElementById(`links${index}`).innerHTML += `<p><a href="${t.url}" class="waves-effect waves-light btn">${t.quality} - ${t.size}</a></p>`
    })
    
    })
    console.log(list.data.movie_count, list.data.limit, list.data.page_number)
    if(Math.ceil(list.data.movie_count/list.data.limit) >= list.data.page_number ){
    expand.innerHTML = `
    <div class="center-align"><a onclick="more(${list.data.movie_count}, ${list.data.page_number}, ${list.data.limit});"class="waves-effect waves-light btn">show more</a></div>`
}else{
    expand.innerHTML = '';
}
}



   
}




async function more(count, pg, lim){
    console.log(count, pg, lim)

    
    if(cate.value !== ''){
        var req = await fetch(`${mApi}?query_term=${search.value}&genre=${cate.value}&page=${pg+1}`)
    }else{
        var req = await fetch(`${mApi}?query_term=${search.value}&page=${pg+1}`)
    }

    let list = await req.json()
    if(list.data.movie_count !== 0){
    list.data.movies.map((m, index) =>{
        contents.innerHTML += renderlist(m.title, m.description_full, m.rating, m.genres.join(', '), m.year, m.medium_cover_image, index)
        
    m.torrents.map(t =>{
        document.getElementById(`links${index}`).innerHTML += `<p><a href="${t.url}" class="waves-effect waves-light btn">${t.quality} - ${t.size}</a></p>`
    })
    
    })
    if(Math.ceil(count/lim) >= pg ){
    expand.innerHTML = `
    <div class="center-align"><a onclick="more(${list.data.movie_count}, ${list.data.page_number}, ${list.data.limit});"class="waves-effect waves-light btn">show more</a></div>`
    }else{
        expand.innerHTML = '';
    }
}
}



function renderlist(title, descrip, rating, genre, year, cover, i){
    
    return `
    <div class="card large sticy-action col s12 m5 l4">
            <div class="card-image waves-effect waves-block waves-light">
              <img class="activator responsive-img" src="${cover}">
            </div>
            <div class="card-action">
              <span class="card-title activator grey-text text-darken-4">${title}<i class="material-icons right">more_vert</i></span>
              <p id="gen"><b>Genre: </b>${genre}</p>
              <p id="rate"><b>Rating: </b>${rating}</p>
              <p id="year"><b>Year: </b>${year}</p>
              
            </div>
            <div class="card-reveal">
<span class="card-title grey-text text-darken-4">${title}<i class="material-icons right">close</i></span>
              <p>${descrip}</p>
              <div id="links${i}">
              
              </div>
            </div>
          </div>`
}

