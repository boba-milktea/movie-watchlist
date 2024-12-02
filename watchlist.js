let movieWatchlist = [];
let movieFeed = "";

// load movies from local storage
const moviesToWatch = localStorage.getItem("movies");

// parse the movies to movie watchlist
movieWatchlist = moviesToWatch ? JSON.parse(moviesToWatch) : [];

// return movie feed
getMovieFeed = () => {
  movieFeed = "";
  for (let movie of movieWatchlist) {
    movieFeed += `
    <div class="movie">
    <img src="${movie.Poster}" />
    <div class="movie-detail">
      <div class="first-line">
        <h3 class="movie-title">${movie.Title}</h3>
        <p><img class="star-icon" src="./Assets/Star-icon.png" />${
          movie.imdbRating
        }</p>
      </div>
      <div class="second-line">
        <p class="small-text">${movie.Runtime}</p>
        <p class="small-text">${movie.Genre.substring(0, 25)}</p>
        <button id="remove-btn" data-remove=${movie.imdbID}>
          <img class="minus-icon" src="./Assets/Minus.png"/>Remove
        </button>
      </div>
      <p class="description"> ${movie.Plot.slice(0, 130)}...</p>
      <hr />
    </div>
   `;
  }

  return movieFeed;
};

// remove a movie
document.addEventListener("click", function (e) {
  if (e.target.dataset.remove) {
    removeMovie(e.target.dataset.remove);
  }
});

removeMovie = (removeMovieId) => {
  // find the movie's index in the array
  const movieToRemove = movieWatchlist.findIndex(
    (movie) => movie.imdbID === removeMovieId
  );

  // remove the movie using splice (index, delete count )
  movieWatchlist.splice(movieToRemove, 1);

  // save the new list to the local storage
  localStorage.setItem("movies", JSON.stringify(movieWatchlist));
  renderMovie();
};

// render movies
renderMovie = () => {
  const watchlistBox = document.getElementById("watchlist-box");
  document.getElementById("watchlist").innerHTML = getMovieFeed();
  watchlistBox.classList.add("hidden");

  if (movieWatchlist.length === 0) {
    watchlistBox.classList.remove("hidden");
  }
};

renderMovie();
