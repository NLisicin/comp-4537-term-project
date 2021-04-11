$(document).ready(() => {

    // POST review
    const submitReview = (form, category, id) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("POST", ROOT + category + "/review/" + id + API_KEY, true)
        XHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHTTP.send(form.serialize());
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 201) {
                alert("Added review");
                form[0].reset();
                buildReviews(category, id);
            }
        }
    }

    // Build review card element from row data
    const buildReviewCard = (review) => {
        const STARS = "&#9733;".repeat(review["rating"]) + "&#9734;".repeat(5 - review["rating"]);

        return "<br />" +
            "<div class='card'>" +
            "    <div class='card-body'>" +
            "        <h5 class='card-title'>" + review["user_name"] + "</h5>" +
            "        <h6 class='card-subtitle'>" + STARS + "</h5>" +
            "        <p class='card-text'>" + review["review"] + "</p>" +
            "    </div>" +
            "</div>";
    }

    // DELETE item
    const deleteItem = (category, id) => {
        if (confirm("WARNING: The " + category + " and its reviews will be deleted. Continue?")) {
            const XHTTP = new XMLHttpRequest();
            XHTTP.open("DELETE", ROOT + category + "/" + id + API_KEY, true)
            XHTTP.send();
            XHTTP.onreadystatechange = () => {
                if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                    window.location.replace("./index.html");
                }
            }
        }
    }

    // Add category-specific details to item card
    const addCategoryDetails = (category, row) => {
        switch (category) {
            case "movie":
                return "<p class='card-text'><b>Director:</b> " + row["director"] + "</p>" +
                    "<p class='card-text'><b>Writer:</b> " + row["writer"] + "</p>" +
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
            "        <a id='delete-button' class='btn btn-danger'><i class='material-icons'>delete</i></a> " +
            "        <a class='btn btn-primary' href='./updateItem.html?category=" + category + "&id=" + row["id"] + "'><i class='material-icons'>edit</i></a>" +
            "    </div>" +
            "</div>";
    }

    // GET review data
    const buildReviews = (category, id) => {
        $("#reviews").empty();
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("GET", ROOT + category + "/review/" + id + API_KEY, true)
        XHTTP.send();
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                const ROWS = JSON.parse(XHTTP.responseText);
                for (let i = 0; i < ROWS.length; i++) {
                    $("#reviews").append(buildReviewCard(ROWS[i]));
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
                $("#item").on("click", "#delete-button", () => deleteItem(category, id));
                $("#new-review-form-card").show();
                buildReviews(category, id);
            } else if (XHTTP.readyState == 4 && XHTTP.status == 404) {
                $("#item").append("Invalid item ID.");
            }
        }
    }

    const PARAMS = new URLSearchParams(window.location.search);
    const CATEGORY = PARAMS.get("category");
    const ID = PARAMS.get("id");
    const FORM = $("#new-review-form");

    buildPage(CATEGORY, ID);

    FORM.submit((e) => {
        e.preventDefault();
        submitReview(FORM, CATEGORY, ID);
    });
});