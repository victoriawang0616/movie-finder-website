document.addEventListener("DOMContentLoaded", async () => {
  loadPopularMovies();

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const genreButtons = document.querySelectorAll(".genre-filter");

  if (searchBtn) {
    searchBtn.addEventListener("click", async () => {
      const query = searchInput.value.trim();

      if (!query) {
        const moviesGrid = document.getElementById("moviesGrid");
        moviesGrid.innerHTML = `<div class="col-12 text-warning">Please enter a movie name.</div>`;
        return;
      }

      const data = await searchMovies(query);
      displayMovies(data.results);
    });
  }

  genreButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const genre = button.dataset.genre;

      document.querySelectorAll(".genre-filter").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      if (genre === "all") {
        loadPopularMovies();
      } else {
        const data = await fetchMoviesByGenre(genre);
        displayMovies(data.results);
      }
    });
  });
});

async function loadPopularMovies() {
  const data = await fetchPopularMovies();
  displayMovies(data.results);
}