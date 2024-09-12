const apiKey = '831e59a8d9ae442d6aa29ac809350b81';

async function fetchNews(url, containerId, limit = 4) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        displayNews(data.articles, containerId, limit);
    } catch (error) {
        console.error('Failed to fetch news:', error);
        displayErrorMessage(containerId);
    }
}

function displayNews(articles, containerId, limit) {
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
                    <a href="${article.url}" target="_blank" class="btn" style="color: red; text-decoration: underline;">Read more <i class='bx bx-right-arrow-alt align-middle'></i></a>
                </div>
            </div>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function displayErrorMessage(containerId) {
    const newsContainer = document.getElementById(containerId);
    if (newsContainer) {
        newsContainer.innerHTML = `<p>Failed to fetch news. Please try again later.</p>`;
    }
}

function loadIndexPage() {
    fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&apikey=' + apiKey, 'newsContainer', 4);
    fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=sports&apikey=' + apiKey, 'sportsContainer', 4);
    fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=hollywood&apikey=' + apiKey, 'hollywoodContainer', 4);
    fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=technology&apikey=' + apiKey, 'techContainer', 4);
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
            }
        });

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                searchBtn.click();
            }
        });
    } else {
        console.error('Search input or button not found');
    }
}

function loadPageContent() {
    const path = window.location.pathname;
    if (path.includes("index.html")) {
        loadIndexPage();
    } else if (path.includes("latest.html")) {
        fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&apikey=' + apiKey, 'newsContainer', 8);
    } else if (path.includes("sports.html")) {
        fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=sports&apikey=' + apiKey, 'sportsContainer', 8);
    } else if (path.includes("tech.html")) {
        fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=technology&apikey=' + apiKey, 'techContainer', 8);
    } else if (path.includes("hollywood.html")) {
        fetchNews('https://gnews.io/api/v4/top-headlines?lang=en&country=us&category=hollywood&apikey=' + apiKey, 'hollywoodContainer', 8);
    }
}

window.onload = () => {
    loadPageContent();
    handleSearch();
};
