function getCurrentUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

function getUserWatchlist() {
    const user = getCurrentUser();
    if (!user) return [];
    const watchlistKey = `watchlist_${user.email}`;
    const watchlist = localStorage.getItem(watchlistKey);
    return watchlist ? JSON.parse(watchlist) : [];
}

function saveUserWatchlist(watchlist) {
    const user = getCurrentUser();
    if (!user) return;
    const watchlistKey = `watchlist_${user.email}`;
    localStorage.setItem(watchlistKey, JSON.stringify(watchlist));
}

function addToWatchlist(movie) {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login first');
        window.location.href = 'login.html';
        return false;
    }

    let watchlist = getUserWatchlist();
    const exists = watchlist.some(m => m.id == movie.id);
    if (exists) {
        alert('Movie already in watchlist');
        return false;
    }

    watchlist.push({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path || movie.poster,
        year: movie.release_date ? movie.release_date.split('-')[0] : movie.year || 'N/A'
    });
    saveUserWatchlist(watchlist);
    alert('Added to watchlist');
    return true;
}

function removeFromWatchlist(movieId) {
    let watchlist = getUserWatchlist();
    const updated = watchlist.filter(m => m.id != movieId);
    saveUserWatchlist(updated);
    alert('Removed from watchlist');
    displayWatchlist();
}

function displayMovieDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        document.getElementById('movieDetail').innerHTML = '<p class="text-white text-center">No movie selected</p>';
        return;
    }

    const apiKey = '8c922c54c00669f7d10e9794dfade458';
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
        .then(res => res.json())
        .then(movie => {
            const posterUrl = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : 'https://via.placeholder.com/500x750?text=No+Poster';
            
            const detailHTML = `
                <div class="col-md-4">
                    <img src="${posterUrl}" class="img-fluid rounded" alt="${movie.title} poster">
                </div>
                <div class="col-md-8 text-white">
                    <h1>${movie.title} <span class="text-muted">(${new Date(movie.release_date).getFullYear() || 'N/A'})</span></h1>
                    <p><strong>Rating:</strong> ${movie.vote_average} / 10 (${movie.vote_count} votes)</p>
                    <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
                    <p><strong>Overview:</strong> ${movie.overview || 'No description available.'}</p>
                    <button id="addToWatchlistBtn" class="btn btn-warning mt-3" 
                        data-id="${movie.id}" 
                        data-title="${movie.title}" 
                        data-poster="${movie.poster_path}">
                        + Add to Watchlist
                    </button>
                </div>
            `;
            document.getElementById('movieDetail').innerHTML = detailHTML;

            const btn = document.getElementById('addToWatchlistBtn');
            if (btn) {
                btn.addEventListener('click', () => {
                    addToWatchlist({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        release_date: movie.release_date
                    });
                });
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('movieDetail').innerHTML = '<p class="text-danger text-center">Failed to load movie details</p>';
        });
}

function displayWatchlist() {
    const container = document.getElementById('watchlistContainer');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) {
        container.innerHTML = '<div class="alert alert-warning">Please <a href="login.html" class="alert-link">login</a> to view your watchlist</div>';
        return;
    }

    const watchlist = getUserWatchlist();
    if (watchlist.length === 0) {
        container.innerHTML = '<div class="alert alert-info text-white bg-dark">Your watchlist is empty. Go to <a href="index.html" class="alert-link">search</a> to add movies</div>';
        return;
    }

    let html = '<div class="row">';
    watchlist.forEach(movie => {
        const posterUrl = movie.poster 
            ? `https://image.tmdb.org/t/p/w200${movie.poster}` 
            : 'https://via.placeholder.com/200x300?text=No+Poster';
        
        html += `
            <div class="col-md-3 col-sm-6 mb-4">
                <div class="card bg-secondary text-white h-100">
                    <img src="${posterUrl}" class="card-img-top" alt="${movie.title} poster" style="height: 300px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <p class="card-text"><small>${movie.year || 'N/A'}</small></p>
                        <button class="btn btn-danger btn-sm remove-from-watchlist" data-id="${movie.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    document.querySelectorAll('.remove-from-watchlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removeFromWatchlist(id);
        });
    });
}

function updateNavbar() {
    const user = getCurrentUser();
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    if (user) {
        navLinks.innerHTML = `
            <span class="text-white">${user.username || user.email}</span>
            <button id="logoutBtn" class="btn btn-outline-light btn-sm">Logout</button>
            <a href="watchlist.html" class="btn btn-outline-warning btn-sm">Watchlist</a>
        `;
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            });
        }
    } else {
        navLinks.innerHTML = `
            <a href="login.html" class="btn btn-outline-light btn-sm">Login</a>
            <a href="register.html" class="btn btn-outline-light btn-sm">Register</a>
        `;
    }
}

updateNavbar();

if (window.location.pathname.includes('movie.html')) {
    displayMovieDetail();
} else if (window.location.pathname.includes('watchlist.html')) {
    displayWatchlist();
}