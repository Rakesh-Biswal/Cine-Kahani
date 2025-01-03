window.addEventListener('DOMContentLoaded', async () => {
    const serviceGrid = document.querySelector('.service-grid');

    try {
        const response = await fetch('http://localhost:3000/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');

        const movies = await response.json();

        movies.forEach(movie => {
            const isFree = movie.movieType === "Free";
            const buttonText = isFree
                ? `Download for Free`
                : `⬇️Get Movie ₹${movie.price}`;
            const buttonStyle = isFree
                ? 'background-color: #4caf50; color: white;'
                : 'background-color: #ff9800; color: white;';

            const movieType = movie.movieType;
            let boxText = '';
            let backgroundColor = '';
            let textColor = '';

            if (movieType === 'Free') {
                boxText = '❤ Free';
                backgroundColor = '#32CD32'; // Light green
                textColor = '#FFFFFF'; // White
            } else if (movieType === 'Paid') {
                boxText = `Paid ₹${movie.price}`;
                backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Red
                textColor = '#fff';
            }

            const cardHTML = `
                <div class="service-item">
                    <div class="movie-type-box" style="background-color: ${backgroundColor}; color: ${textColor};">
                        ${boxText}
                    </div>
                    <img src="${movie.imageURL}" alt="${movie.movieName}">
                    <h3>${movie.movieName}</h3>
                    <p>${movie.movieDescription}</p>
                    <div class="service-buttons">
                        <button class="details-btn">More Info 🔍</button>
                        <button class="buy-btn" style="${buttonStyle}" data-movie-name="${movie.movieName}">${buttonText}</button>
                    </div>
                </div>`;

            serviceGrid.insertAdjacentHTML('afterbegin', cardHTML);
        });

        // Attach event listeners to all buy buttons after rendering
        serviceGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                const movieName = e.target.getAttribute('data-movie-name');
                window.location.href = `http://127.0.0.1:5500/dashboard.html?movieName=${encodeURIComponent(movieName)}`;
            }
        });
    } catch (error) {
        console.error(error);
    }
});
