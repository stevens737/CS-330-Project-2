// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// Keys and ID
const API_KEY = 'AIzaSyAzvdB0Z0pjYMM1p3G_wNZrYib1Y7pUxvw';
const SEARCH_ENGINE_ID = '51a8a3509560d47aa';

// Base API URL
const API_BASE_URL = 'https://customsearch.googleapis.com/customsearch/v1';


// Main Functions

$(document).ready(function () {
    // Hide the results and time until interaction with site
    $('#searchResults').hide();
    $('#time').hide();

    // Search Button click handler
    $('#searchButton').on('click', function () {
        const query = $('#query').val(); // Pull in query input

        // Return if there is nothing searched
        if (!query) {
            return
        }

        const requestURL = API_BASE_URL + "?key=" + API_KEY + "&cx=" + SEARCH_ENGINE_ID + "&q=" + encodeURIComponent(query);

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
    });

    $('#timeButton').on('click', function () {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // Ensures two digits
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensures two digits
        const currentTime = `${hours}:${minutes}`;

        // Set the text of the div and open it as a dialog
        $('#time').text(`The current time is ${currentTime}`);
        $('#time').dialog();
    });
});

function displayResults(data) {
    const searchResultsDiv = $('#searchResults');
    searchResultsDiv.empty().show();

    if (data.items && data.items.length > 0) {
        // Loop through each search result item
        data.items.forEach(function (item) {
            // Create HTML for each result
            const resultHtml = `
                <div class="search-result">
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <a href="${item.link}" class="result-link" target="_blank">${item.formattedUrl}</a>
                    <p class="result-snippet">${item.snippet}</p>
                </div>
            `;
            searchResultsDiv.append(resultHtml); // Add the result to the page
        });
    } else {
        searchResultsDiv.html('<p>No results found for your query.</p>');
    }
}