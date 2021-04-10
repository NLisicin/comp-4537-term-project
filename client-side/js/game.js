$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";
    
    // Build review card element from row data
    function buildReviewCard(review) {
        let stars = "";
        for (let i = 0; i < review["rating"]; i++) {
            stars += "&#9733;";
        }
        const card = [
            "<br />",
            "<div class='card'>",
            "    <div class='card-body'>",
            "        <h5 class='card-title'>" + stars + "</h5>",
            "        <p class='card-text'>" + review["review"] + "</p>",
            "    </div>",
            "</div>"
        ].join("\n");
        return card;
    }

    // Build game card element from row data
    function buildGameCard(game) {
        const card = [
            "<div class='card'>",
            "    <div class='card-body'>",
            "        <h5 class='card-title'>" + game["title"] + "</h5>",
            "        <h6 class='card-subtitle mb-2 text-muted'>" + game["release_date"] + "</h6>",
            "        <p class='card-text'>" + game["description"] + "</p>",
            "        <p class='card-text'><b>Created By:</b> " + game["creator"] + "</p>",
            "    </div>",
            "</div>"
        ].join("\n");
        return card;
    }

    // GET review data from server
    function buildReviews(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "game/review/" + id, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const rows = JSON.parse(xhttp.responseText)[0];
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    $("#reviews").append(buildReviewCard(row));
                }
            }
        }
    }

    // GET game data from server
    function buildPage(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "game/" + id, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const row = JSON.parse(xhttp.responseText)[0];
                $("#game").append(buildGameCard(row));
                buildReviews(id);
            }
        }
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id")
    const form = $("#new-review-form");

    buildPage(id);

    form.attr("action", ROOT + "game/review/" + id);

    $("#form-submit").click(() => {   
        $.ajax({
            type: form.attr("method"),
            url: form.attr("action"),
            data: form.serialize(),
            success: () => {
                alert("Review submitted");
                window.location.reload();
            },
            error: () => {
                alert("Error submitting review");
            }
        });
        return false;
    });
});