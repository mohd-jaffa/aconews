const apiKey = '831e59a8d9ae442d6aa29ac809350b81';

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (query) {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    }
});

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const path = window.location.pathname;

    if (searchQuery) {
        document.getElementById('searchTitle').innerText = `Search results for: "${searchQuery}"`;
        fetchSearchResults(searchQuery);
    } else if (path.includes("latest.html")) {
        fetchLatestNews('latestnewsContainer', 8);
    } else if (path.includes("sports.html")) {
        fetchSportsNews('sportsnewsContainer', 8);
    } else if (path.includes("tech.html")) {
        fetchTechNews('technewsContainer', 8);
    } else if (path.includes("hollywood.html")) {
        fetchHollywoodNews('hollywoodnewsContainer', 8);
    } else {
        fetchLatestNews('latestnewsContainer', 4);
    }
};

async function fetchLatestNews(containerId, limit = 8) {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&apikey=${apiKey}`;
    const data = await fetchNews(url);
    if (data) displayNews(data.articles, containerId, limit);
}

async function fetchSportsNews(containerId, limit = 8) {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=sports&apikey=${apiKey}`;
    const data = await fetchNews(url);
    if (data) displayNews(data.articles, containerId, limit);
}

async function fetchTechNews(containerId, limit = 8) {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=technology&apikey=${apiKey}`;
    const data = await fetchNews(url);
    if (data) displayNews(data.articles, containerId, limit);
}

async function fetchHollywoodNews(containerId, limit = 8) {
    const url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=hollywood&apikey=${apiKey}`;
    const data = await fetchNews(url);
    if (data) displayNews(data.articles, containerId, limit);
}

async function fetchSearchResults(query) {
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&apikey=${apiKey}`;
    const data = await fetchNews(url);
    if (data) displayNews(data.articles, 'searchResultsContainer', 4);
}

async function fetchNews(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch news:', error);
        displayErrorMessage();
    }
}

function displayNews(articles, containerId, limit = 4) {
    const newsContainer = document.getElementById(containerId);
    if (!newsContainer) return; 
    newsContainer.innerHTML = '';

    const limitedArticles = articles.slice(0, limit);

    limitedArticles.forEach(article => {
        const newsItem = document.createElement('div');
        newsItem.className = 'col-md-3 mb-4 d-flex';
        newsItem.innerHTML = `
            <div class="card flex-fill border-0">
                <img src="${article.image || 'default-image.jpg'}" class="card-img-top rounded" alt="${article.title}" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description ? (article.description.length > 100 ? article.description.substring(0, 100) + '...' : article.description) : 'No description available'}</p>
                    <a href="${article.url}" target="_blank" class="btn" style="color: red; text-decoration: underline;">Read more<i class='bx bx-right-arrow-alt align-middle'></i></a>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function displayErrorMessage() {
    const containers = ['latestnewsContainer', 'sportsnewsContainer', 'technewsContainer', 'hollywoodnewsContainer', 'searchResultsContainer'];
    containers.forEach(containerId => {
        const newsContainer = document.getElementById(containerId);
        if (newsContainer) {
            newsContainer.innerHTML = `<p>Failed to fetch news. Please try again later.</p>`;
        }
    });
}
