const searchBtn = document.getElementById("search-btn");
const searchValue = document.getElementById("search");

let movieList;
const listedMovie = [];
const moviesToWatch = [];

searchBtn.addEventListener("click", async () => {
  if (searchValue.value) {
    try {
      // Fetch the movies, return promise
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=64920f0d&s=${searchValue.value}`
      );
      if (!res.ok) {
        throw new Error(`Response Status: ${res.status}`);
      }
      // Await the movie list
      const movie = await res.json();
      // If the response is False, console the error message
      if (movie.Response === "False") {
        console.log(movie.Error);
        document.querySelector(".exploring-box").innerHTML =
          "<h3>Unable to find what you’re looking for. Please try another search.</h3>";
        return;
      }
      // If the response is True, call getMovieList function
      movieList = movie.Search;
      await renderMovie();
    } catch (error) {
      console.error(error.message);
    }
  } else {
    document.querySelector(".exploring-box").innerHTML =
      "<h3>Unable to find what you’re looking for. Please try another search.</h3>";
  }
  // clear the search button
  searchValue.value = "";
});

function getMovieFeed() {
  //get the movie details based on their id
  return movieList.map((movie) => {
    return fetch(`http://www.omdbapi.com/?apikey=64920f0d&i=${movie.imdbID}`)
      .then((res) => res.json())
      .then((movieDetails) => {
        listedMovie.push(movieDetails);
        return `
          <div class="movie">
          <img src="${movieDetails.Poster}" />
          <div class="movie-detail">
            <div class="first-line">
              <h3 class="movie-title">${movieDetails.Title}</h3>
              <p><img class="star-icon" src="./Assets/Star-icon.png" />${
                movieDetails.imdbRating
              }</p>
            </div>
            <div class="second-line">
              <p class="small-text">${movieDetails.Runtime}</p>
              <p class="small-text">${movieDetails.Genre}</p>
              <button id="add-btn" data-add=${movieDetails.imdbID}>
                <img class="plus-icon" src="./Assets/Plus.png"/>Watchlist
              </button>
            </div>
            <p id="description-${movieDetails.imdbID}" class="description">
            ${
              movieDetails.Plot.length < 130
                ? movieDetails.Plot
                : movieDetails.Plot.slice(0, 130) +
                  "<span class='full-description' id='read-more' data-full=" +
                  movieDetails.imdbID +
                  ">...read more</span>"
            }
            </p>
          </div>
              <hr />
         `;
      });
  });
}

function renderMovie() {
  Promise.all(getMovieFeed()).then((movies) => {
    document.getElementById("movie-list").innerHTML = movies.join("");
    document.querySelector(".exploring-box").classList.add("hidden");
  });
}

// Evenlistener for buttons

document.addEventListener("click", function (e) {
  if (e.target.dataset.full) {
    getFullDescription(e.target.dataset.full);
  }
  if (e.target.dataset.add) {
    addToWatchlist(e.target.dataset.add);
  }
  if (e.target.id === "watchlist-btn") {
    saveToWatchlist();
  }
});

// display the full movie description

getFullDescription = (movieId) => {
  const movieObj = listedMovie.filter((movie) => {
    return movie.imdbID === movieId;
  })[0];
  document.getElementById(`description-${movieObj.imdbID}`).innerHTML =
    movieObj.Plot;
};

// add movies to to watch list

addToWatchlist = (addedMovieId) => {
  const movieObj = listedMovie.filter((movie) => {
    return movie.imdbID === addedMovieId;
  })[0];

  moviesToWatch.push(movieObj);
};

// save movies to local storage

saveToWatchlist = () => {
  localStorage.setItem("movies", JSON.stringify(moviesToWatch));
};
