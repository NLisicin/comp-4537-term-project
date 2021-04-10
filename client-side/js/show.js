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

    // Build show card element from row data
    function buildShowCard(show) {
        const card = [
            "<div class='card'>",
            "    <div class='card-body'>",
            "        <h5 class='card-title'>" + show["title"] + "</h5>",
            "        <h6 class='card-subtitle mb-2 text-muted'>" + show["release_date"] + "</h6>",
            "        <p class='card-text'>" + show["description"] + "</p>",
            "        <p class='card-text'><b>Director:</b> " + show["director"] + "</p>",
            "        <p class='card-text'><b>Seasons:</b> " + show["seasons"] + "</p>",
            "    </div>",
            "</div>"
        ].join("\n");
        return card;
    }

    // GET review data from server
    function buildReviews(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "show/review/" + id, true)
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

    // GET show data from server
    function buildPage(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "show/" + id, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const row = JSON.parse(xhttp.responseText)[0];
                $("#show").append(buildShowCard(row));
                buildReviews(id);
            }
        }
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id")
    const form = $("#new-review-form");

    buildPage(id);

    form.attr("action", ROOT + "show/review/" + id);

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