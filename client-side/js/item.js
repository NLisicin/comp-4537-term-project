$(document).ready(() => {

    //POST review
    const submitReview = (form, category, id) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("POST", ROOT + category + "/review/" + id, true)
        XHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHTTP.send(API_KEY + form.serialize());
        XHTTP.onreadystatechange = () => {
            console.log(XHTTP.status);
            if (XHTTP.readyState == 4 && XHTTP.status == 201) {
                alert("Added review");
                form[0].reset();
            }
        }
    }

    // Build review card element from row data
    const buildReviewCard = (review) => {
        const STARS = ("&#9733;" * review["rating"]) + ("&#9734;" * (5 - review["rating"]));

        const CARD =
            "<br />" +
            "<div class='card'>" +
            "    <div class='card-body'>" +
            "        <h5 class='card-title'>" + STARS + "</h5>" +
            "        <p class='card-text'>" + review["review"] + "</p>" +
            "    </div>" +
            "</div>"
        return CARD;
    }

    // Add category-specific details to item card
    const addCategoryDetails = (category, row) => {
        switch (category) {
            case "movie":
                return "<p class='card-text'><b>Directed:</b> " + row["director"] + "</p>" +
                    "<p class='card-text'><b>Written:</b> " + row["writer"] + "</p>" +
                    "<p class='card-text'><b>Release Date:</b> " + row["release_date"] + "</p>" +
                    "<p class='card-text'><b>Category:</b> " + row["category"] + "</p>" +
                    "<p class='card-text'><b>Runtime:</b> " + row["runtime"] + "</p>";
            case "show":
                return "<p class='card-text'><b>Director:</b> " + row["director"] + "</p>" +
                    "<p class='card-text'><b>Seasons:</b> " + row["seasons"] + "</p>";
            case "game":
                return "<p class='card-text'><b>Created By:</b> " + row["creator"] + "</p>";
        }
    }

    // Build item card element from row data
    const buildItemCard = (category, row) => {
        return "<div class='card'>" +
            "    <div class='card-body'>" +
            "        <h5 class='card-title'>" + row["title"] + "</h5>" +
            "        <h6 class='card-subtitle mb-2 text-muted'>" + row["release_date"] + "</h6>" +
            "        <p class='card-text'>" + row["description"] + "</p>" +
            addCategoryDetails(category, row) +
            "    </div>" +
            "</div>";
    }

    // GET review data
    const buildReviews = (category, id) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("GET", ROOT + category + "/review/" + id + API_KEY, true)
        XHTTP.send();
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                const ROWS = JSON.parse(XHTTP.responseText)[0];
                for (let i = 0; i < ROWS.length; i++) {
                    const ROW = ROWS[i];
                    $("#reviews").append(buildReviewCard(ROW));
                }
            }
        }
    }

    // GET item data
    const buildPage = (category, id) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("GET", ROOT + category + "/" + id + API_KEY, true)
        XHTTP.send();
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                const ROW = JSON.parse(XHTTP.responseText)[0];
                $("#item").append(buildItemCard(category, ROW));
                buildReviews(category, id);
            }
        }
    }

    const PARAMS = new URLSearchParams(window.location.search);
    const CATEGORY = PARAMS.get("category")
    const ID = PARAMS.get("id")
    const FORM = $("#new-review-form");

    buildPage(CATEGORY, ID);

    FORM.submit((e) => {
        e.preventDefault();
        submitReview(FORM, CATEGORY, ID);
    });
});