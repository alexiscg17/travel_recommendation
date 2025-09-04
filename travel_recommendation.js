document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const btnSearch = document.getElementById("btnSearch");
    const btnClear = document.getElementById("btnClear");
    const resultsDiv = document.getElementById("results");

    let travelData = {};

    fetch("travel_recommendation_api.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            travelData = data;
        })
        .catch(error => console.error("Error loading JSON:", error));

    function displayResults(items) {
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        if (items.length > 0) {
            resultsDiv.style.display = "flex"; // or "block"
            items.forEach(item => {
                resultsDiv.innerHTML += `
                  <div class="recommendation_card">
                    <img src="${item.imageUrl || './images/dummyImage.jpg'}" alt="${item.name}">
                    <h1>${item.name}</h1>
                    <h2>${item.description}</h2>
                  </div>
                `;
            });
        } else {
            resultsDiv.style.display = "none"; // hide if no matches
        }
    }

    function searchDestinations(keyword) {
        const key = keyword.toUpperCase();
        let matches = [];

        if (key.includes("BEACH")) {
            matches = matches.concat(travelData.beaches || []);
        }

        if (key.includes("TEMPLE")) {
            matches = matches.concat(travelData.temples || []);
        }

        travelData.countries?.forEach(country => {
            if (country.name.toUpperCase().includes(key)) {
                matches.push({ name: country.name, description: "", imageUrl: "" });
            }
            country.cities.forEach(city => {
                if (
                    city.name.toUpperCase().includes(key) ||
                    city.description.toUpperCase().includes(key)
                ) {
                    matches.push(city);
                }
            });
        });

        travelData.temples?.forEach(temple => {
            if (
                temple.name.toUpperCase().includes(key) ||
                temple.description.toUpperCase().includes(key)
            ) {
                matches.push(temple);
            }
        });

        // Search beaches
        travelData.beaches?.forEach(beach => {
            if (
                beach.name.toUpperCase().includes(key) ||
                beach.description.toUpperCase().includes(key)
            ) {
                matches.push(beach);
            }
        });

        const uniqueMatches = Array.from(
            new Map(matches.map(item => [item.name, item])).values()
        );

        displayResults(uniqueMatches);
    }

    btnSearch.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            searchDestinations(keyword);
        }
    });

    btnClear.addEventListener("click", () => {
        searchInput.value = "";
        resultsDiv.innerHTML = "";
    });
});
