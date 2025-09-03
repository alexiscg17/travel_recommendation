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
        if (items.length === 0) {
            resultsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        resultsDiv.innerHTML = items.map(item => `
        <div class="card">
          <h3>${item.name}</h3>
          <img src="${item.imageUrl}" alt="${item.name}" style="width:200px;height:auto;">
          <p>${item.description}</p>
        </div>
      `).join("");
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
