document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchHistoryList = document.getElementById('searchHistoryList');
    const spinner = document.getElementById('search-bar-spinner');
    const closeSearchBtn= document.getElementById('closeSearchBtn');
    const suggestionContainer = document.getElementById('serviceSuggestions');
    const debounceDelay = 300;
    let debounceTimer;

    spinner.style.display = 'none'; // Hide spinner initially
    suggestionContainer.style.display = 'flex'; // Show suggestions initially

    const topServices = [
        { name: 'Jawan Full Movie', icon: '🎭' },
        { name: '3 ldiot Movie', icon: '📽️' },
        { name: 'Pushpa 2 Movie', icon: '📺' },
        { name: 'daman', icon: '🎞️' },
        { name: 'Sam-Bahadur', icon: '🍿' }
    ];

    closeSearchBtn.addEventListener('click',()=>{
        document.querySelector('.search-section').style.display = 'none';
    });

    // Generate service suggestion UI
    function displayServiceSuggestions() {
        suggestionContainer.innerHTML = '';
        topServices.forEach(service => {
            const serviceButton = document.createElement('div');
            serviceButton.className = 'service-button';
            serviceButton.innerHTML = `
        <div class="service-icon">${service.icon}</div>
        <div class="service-name">${service.name}</div>
    `;
            serviceButton.addEventListener('click', () => {
                window.location.href = `dashboard.html?movieName=${encodeURIComponent(service.name)}`;
            });
            suggestionContainer.appendChild(serviceButton);
        });
    }

    displayServiceSuggestions();

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query === "") {
            alert("Please enter a search query.");
            return;
        }
        addSearchHistory(query);
        window.location.href = `dashboard.html?movieName=${encodeURIComponent(query)}`;
    });

    // Debounced input event for real-time search
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query === "") {
                searchHistoryList.classList.add('show');
                suggestionContainer.style.display = 'none';
                notFoundMessage.style.display = 'none';

                updateSearchHistoryUI();
                return;
            }
            fetchProfessionData(query);
            searchHistoryList.classList.remove('show');
        }, debounceDelay);
    });

    searchInput.addEventListener('click', () => {
        searchHistoryList.classList.add('show');
        suggestionContainer.style.display = 'none';
        updateSearchHistoryUI();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar-container')) {
            searchHistoryList.classList.remove('show');
            suggestionContainer.style.display = 'flex';
        }
    });

    function updateSearchHistoryUI() {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        searchHistoryList.innerHTML = '';

        if (searchHistory.length === 0) {
            searchHistoryList.classList.remove('show');
            return;
        }

        searchHistory.forEach(query => {
            const listItem = document.createElement('li');
            listItem.textContent = query;
            listItem.addEventListener('click', () => {
                window.location.href = `dashboard.html?movieName=${encodeURIComponent(query)}`;
            });

            const removeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            removeIcon.classList.add('remove-icon');
            removeIcon.innerHTML = '<use href="#remove-icon"></use>';
            removeIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                removeSearchHistory(query);
            });

            listItem.appendChild(removeIcon);
            searchHistoryList.appendChild(listItem);
        });
    }

    function addSearchHistory(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(query)) {
            history.push(query);
            localStorage.setItem('searchHistory', JSON.stringify(history));
        }
        updateSearchHistoryUI();
    }

    function removeSearchHistory(item) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history = history.filter(query => query !== item);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateSearchHistoryUI();
    }

    async function fetchProfessionData(query) {
        notFoundMessage.style.display = 'none';
        spinner.style.display = 'block';
        try {
            const response = await fetch(`https://cine-kahani-backend.onrender.com/api/search/movie`);
            const data = await response.json();

            if (data.movies && data.movies.length > 0) {
                const filteredProfessions = filterAndPrioritizeMovies(data.movies, query);
                updateSearchHistoryWithMovies(filteredProfessions);
            } else {
                notFoundMessage.style.display = 'block';
                throw new Error("No professions found.");
            }
        } catch (error) {
            console.error("Error fetching profession data:", error);
            searchHistoryList.classList.add('show');
        } finally {
            spinner.style.display = 'none';
        }
    }

    function filterAndPrioritizeMovies(movies, query) {
        const filtered = movies.filter(prof => prof.toLowerCase().includes(query.toLowerCase()));
        return filtered.sort((a, b) => {
            if (a.toLowerCase().startsWith(query.toLowerCase())) return -1;
            if (b.toLowerCase().startsWith(query.toLowerCase())) return 1;
            return a.localeCompare(b);
        });
    }

    function updateSearchHistoryWithMovies(movies) {
        searchHistoryList.innerHTML = '';
        const notFoundMessage = document.getElementById('notFoundMessage');

        if (movies.length > 0) {
            movies.forEach(profession => {
                const listItem = document.createElement('li');
                listItem.textContent = profession;
                listItem.addEventListener('click', () => {
                    window.location.href = `dashboard.html?movieName=${encodeURIComponent(profession)}`;
                    addSearchHistory(profession); // Add to search history
                    searchHistoryList.classList.remove('show'); // Hide search history
                    notFoundMessage.style.display = 'none'; // Hide the message
                });
                searchHistoryList.appendChild(listItem);
            });
            searchHistoryList.classList.add('show'); // Show if there are filtered professions
            notFoundMessage.style.display = 'none'; // Hide "Not Found" message
        } else {
            searchHistoryList.classList.remove('show'); // Hide if no professions found
            notFoundMessage.style.display = 'block'; // Show "Not Found" message
        }
    }
});