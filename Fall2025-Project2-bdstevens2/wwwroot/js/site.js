//Background images to swap through and index to track
const backgroundImages = [
    'https://images.unsplash.com/photo-1649687064416-63e29e986aea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1649259441622-6d78703f4ea2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1524611410056-a5ee557e68a3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1642569803366-cd7e48284470?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];
let backgroundImageIndex = 0;

// Main Functions
$(document).ready(function () {
    // Hide the results and time until interaction with site
    $('.results-container').hide();
    $('#time').hide();

    // Search Button click handler
    $('#searchButton').on('click', function () {
        performSearch()
    });

    $('#query').on('keyup', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    })

    $('#timeButton').on('click', function () {
        const now = new Date();
        let hours = String(now.getHours()); // Ensures two digits
        const amOrPM = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours > 0 ? hours : 12;
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensures two digits
        const currentTime = `${hours}:${minutes} ${amOrPM}`;

        $('#time').text(`The current time is ${currentTime}`);
        $('#time').dialog();
    });

    $('#luckyButton').on('click', function () {
        const query = $('#query').val();
        if (!query) { return; }

        const requestURL = `/api/search?query=${encodeURIComponent(query)}`;

        $.ajax({
            url: requestURL,
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            if (data.items && data.items.length > 0) {
                window.location.href = data.items[0].link; 
            } else {
                alert("No results found, so I can't get lucky!");
            }
        }).fail(function (error) {
            console.error("Error fetching search results:", error);
            alert("Sorry, something went wrong.");
        });
    });

    $('#searchEngineName').on('click', function () {
        $('.results-container').hide();
        backgroundImageIndex = (backgroundImageIndex + 1) % backgroundImages.length;
        const newBackgroundURL = backgroundImages[backgroundImageIndex];

        $('body').css('background-image', `url(${newBackgroundURL})`);
    });
});

function displayResults(data) {
    const searchResultsDiv = $('#searchResults');
    $('.results-container').show();
    searchResultsDiv.empty().show();

    if (data.items && data.items.length > 0) {
        data.items.forEach(function (item) {
            // Create HTML for each result
            const resultHtml = `
                <div class="search-result">
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <a href="${item.link}" class="result-link" target="_blank">${item.formattedUrl}</a>
                    <p class="result-snippet">${item.snippet}</p>
                </div>
            `;
            searchResultsDiv.append(resultHtml); 
        });
    } else {
        searchResultsDiv.html('<p>No results found for your query.</p>');
    }
}

function performSearch() {
    const query = $('#query').val(); // Pull in query input

    // Return if there is nothing searched
    if (!query) {
        return
    }

    const requestURL = `/api/search?query=${encodeURIComponent(query)}`;

    $.ajax({
        url: requestURL,
        method: 'GET',
        dataType: 'json'
    }).done(function (data) {
        displayResults(data);
    }).fail(function (error) {
        console.error('Error fetching search results:', error);
        $('#searchResults').html('<p>Sorry, but something went wrong. Please try again.</p>').show();
    });
}