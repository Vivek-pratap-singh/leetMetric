document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("submit-button");
    const usernameInput = document.getElementById("user-input");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-card");

    // Function to validate the username input
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Please enter a username");
            return false;
        }
        const regex = /^[a-zA-Z0-9_]+$/;
        if (!regex.test(username)) {
            alert("Please enter a valid username");
            return false;
        }
        return true;
    }

    function setProgress(circleClass, labelElement, solved, total) {
        const progress = (solved / total) * 100;
        const circle = document.querySelector(`.${circleClass}`);
        circle.style.setProperty('--progress-degree', `${progress}%`);
        labelElement.textContent = `${solved}/${total}`;
    }

    function displayCardData(data, username) {
        cardStatsContainer.innerHTML = `
            <h2>User: ${username}</h2>
            <p>Total Questions Solved: ${data.totalSolved}</p>
            <p>Ranking: ${data.ranking}</p>
            <p>Contribution Points: ${data.contributionPoints}</p>
        `;
    }

    // step 3: Fetch user details from the API
    // step 4: Update the progress bars and display user data
    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Loading...";
            searchButton.disabled = true;
            // waiting for the response from the API
            const response = await fetch(url);
            // check if the response is ok (status code 200-299)
            // if not, throw an error to be caught in the catch block
            if (!response.ok) throw new Error("User not found");

            const data = await response.json();
            console.log("Data fetched:", data);

            // Set progress bars
            setProgress("easy-progress", easyLabel, data.easySolved, data.totalEasy);
            setProgress("medium-progress", mediumLabel, data.mediumSolved, data.totalMedium);
            setProgress("hard-progress", hardLabel, data.hardSolved, data.totalHard);

            displayCardData(data,username);
        } catch (error) {
            cardStatsContainer.innerHTML = "<p style='color: red;'>No Data Found. Please check the username.</p>";
        } finally {
            searchButton.textContent = "Submit";
            searchButton.disabled = false;
        }
    }

    //step 1: Add event listener to the search button
    //step 2: Validate the username input
    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
