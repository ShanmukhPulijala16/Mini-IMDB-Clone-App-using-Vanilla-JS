// The specific URL in the code specifies that you want to get a list of movies sorted by popularity,
// starting with the most popular movie.
const API_URL =
    "https://api.themoviedb.org/3/discover/movie?sort_by =popularity.desc&api_key=a5320afe4b8da043225cea23c0eb7d80&page=1";

// IMAGE_PATH is a string that represents the URL of the TMDb image server. This server hosts images of movies,
// TV shows, and other media. The specific URL in the code specifies that you want to get images that are
// 1280 pixels wide.
const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280/";

// SEARCH_URL is a string that represents the URL of the TMDb search API.
// This API allows you to search for movies by title.
const SEARCH_URL =
    'https://api.themoviedb.org/3/search/movie?api_key=a5320afe4b8da043225cea23c0eb7d80&query="';

// Defining frequently used and necessary constants
const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");
const movieSection = document.getElementById("movie-section");
const favouriteSection = document.getElementById("favourite-section");

main.appendChild(movieSection);
main.appendChild(favouriteSection);

// This gets popular movies by default
getMovies(API_URL);

// Event Listener to get movies when you write something in form and press Enter/Submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = document.getElementById("search");
    const searchValue = search.value;
    if (searchValue && searchValue !== "") {
        getMovies(SEARCH_URL + searchValue);
        searchValue = "";
    }
    else {
        window.location.reload();
    }
});

// Function to fetch movies using url
async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    addMovies(data.results);

    localStorage.setItem("moviesData", JSON.stringify(data.results));

    console.log(data.results);
}

// This array stores movie ids to know which are to be stored in movieSection
let myIdArray = [];

// Event Listener click for fav-button i,e. Heart Icon in Movie Section
movieSection.addEventListener("click", (e) => {
    if (e.target.tagName === "I" && e.target.classList.contains("fa-heart")) {
        e.target.classList.add("green");
        // const dataInfo = divElement.getAttribute("data-info");

        const dataId = e.target.getAttribute("data-id");
        const dataTitle = e.target.getAttribute("data-title");
        const dataPosterPath = e.target.getAttribute("data-poster-path");


        if (myIdArray.length === 0) {
            myIdArray.push(dataId);
        }
        else {

            for (let i = 0; i < myIdArray.length; i++) {
                if (dataId === myIdArray[i]) {
                    // flag = true;
                    return;
                }
            }
            myIdArray.push(dataId);

        }

        const divOfFavMovieContainer = document.createElement("div");
        divOfFavMovieContainer.classList.add("fav-movie-container");
        favouriteSection.appendChild(divOfFavMovieContainer);

        divOfFavMovieContainer.setAttribute("data-id", dataId);
        console.log("Sending dataId: ", dataId);

        divOfFavMovieContainer.innerHTML = `

        <img src="${IMAGE_PATH + dataPosterPath}" alt="" />
        <div class="fav-movie-info">
          <h4>${dataTitle}</h4>
        </div>
        <i class="fa-solid fa-trash fav-trash-button" data-id="${dataId}"></i>

        `
    }

});

// Event Listener click for trash-button i,e. Delete Button in Favourite Section
favouriteSection.addEventListener("click", (e) => {
    if (e.target.tagName === "I" && e.target.classList.contains("fav-trash-button")) {
        e.target.parentElement.remove();

        const movieSectionArray = movieSection.querySelectorAll(".movie-container");

        console.log(movieSectionArray);

        movieSectionArray.forEach((movieContainer) => {
            const dataIdFromMovieContainer = movieContainer.getAttribute("data-id");

            console.log(e.target.getAttribute("data-id"));
            console.log(dataIdFromMovieContainer);


            if (dataIdFromMovieContainer === e.target.getAttribute("data-id")) {
                movieContainer.querySelector(".fa-heart").classList.remove("green");
                const indexToRemove = myIdArray.indexOf(e.target.getAttribute("data-id"));
                myIdArray.splice(indexToRemove, 1);
                return;
            }
        });

    }

});

// Add Movies using movies data array we get from get movies url
function addMovies(dataResultsArray) {
    movieSection.innerHTML = '';

    dataResultsArray.forEach((currElement) => {

        const { id, title, vote_average, poster_path, overview } = currElement;

        // Using the toFixed() method to round up the value to 1 decimal
        const voteAverage = vote_average.toFixed(1);

        var divOfMovieContainer = document.createElement("div");
        divOfMovieContainer.classList.add("movie-container");

        movieSection.appendChild(divOfMovieContainer);

        divOfMovieContainer.setAttribute("data-id", id)

        divOfMovieContainer.innerHTML = `
        <img src="${IMAGE_PATH + poster_path}" alt="" />
        <div class="fav-button">
          <span><i class="fa-solid fa-heart fa-2xl" data-id="${id}" data-title="${title}" data-poster-path="${poster_path}"></i></span>
        </div>
        <div class="movie-info">
          <h3>${title}</h3>
          <span>${voteAverage}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${overview}
        </div>
        `

    });

};

// On page load, check if there is data in localStorage and retrieve it
window.addEventListener("DOMContentLoaded", () => {
    const storedMoviesData = localStorage.getItem("moviesData");
    if (storedMoviesData) {
        const parsedStoredMoviesData = JSON.parse(storedMoviesData);
        addMovies(parsedStoredMoviesData);
    }


});

// Function to save the favorite movies data to localStorage
function saveFavouriteMoviesToLocalStorage(favouritesArray) {
    localStorage.setItem("favouriteMoviesData", JSON.stringify(favouritesArray));
}

function loadFavouriteMoviesFromLocalStorage() {
    const storedFavouriteMoviesData = localStorage.getItem("favouriteMoviesData");
    if (storedFavouriteMoviesData) {
        const parsedStoredFavouriteMoviesData = JSON.parse(storedFavouriteMoviesData);
        return parsedStoredFavouriteMoviesData;
    }

    // or you can also do this
    // const storedData = localStorage.getItem("favoriteMovies");
    // return storedData ? JSON.parse(storedData) : [];

}

// New Code here
function storeFavouriteMoviesData() {
    let favouriteMoviesData = JSON.stringify(myIdArray);
    localStorage.setItem("favouriteMoviesData", favouriteMoviesData);
}
