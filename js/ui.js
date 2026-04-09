function displayMovies(movies) {
  const moviesGrid = document.getElementById("moviesGrid");

  if (!moviesGrid) return;

  if (!movies || movies.length === 0) {
    moviesGrid.innerHTML = `<div class="col-12 text-warning">No results found.</div>`;
    return;
  }

  moviesGrid.innerHTML = movies.map(movie => `
    <div class="col-md-3 col-sm-6 mb-4">
      <a href="movie.html?id=${movie.id}" class="text-decoration-none text-light">
        <div class="card bg-dark text-light h-100 shadow">
          <img
            src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}"
            class="card-img-top"
            alt="${movie.title}"
          >
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">⭐ ${movie.vote_average}</p>
            <p class="card-text"><small>${movie.release_date || "No release date"}</small></p>
          </div>
        </div>
      </a>
    </div>
  `).join("");
}