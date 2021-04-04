$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";
    
    function buildReviewCard(review) {
        const card = [
            "<div class='card'>",
            "    <div class='card-body'>",
            "        <h5 class='card-title'>" + review["rating"] + "</h5>",
            "        <p class='card-text'>" + review["review"] + "</p>",
            "    </div>",
            "</div>"
        ].join("\n");
        return card;
    }

    function buildReviewForm(id) {
        const form = [
            "<form method='POST' action='" + ROOT + "movie/review/" + id + "'>",
            "    <div class='mb-3'>",
            "        <h4>Add a Review</h4>",
            "    </div>",
            "    <div class='mb-3'>",
            "        <h5>Rating</h5>",
            "        <div class='form-check form-check-inline'>",
            "            <input class='form-check-input' type='radio' name='rating' id='input-rating-1' value='1'>",
            "            <label class='form-check-label' for='input-rating-1'>1</label>",
            "        </div>",
            "        <div class='form-check form-check-inline'>",
            "            <input class='form-check-input' type='radio' name='rating' id='input-rating-2' value='2'>",
            "            <label class='form-check-label' for='input-rating-2'>2</label>",
            "        </div>",
            "        <div class='form-check form-check-inline'>",
            "            <input class='form-check-input' type='radio' name='rating' id='input-rating-3' value='3'>",
            "            <label class='form-check-label' for='input-rating-3'>3</label>",
            "        </div>",
            "        <div class='form-check form-check-inline'>",
            "            <input class='form-check-input' type='radio' name='rating' id='input-rating-4' value='4'>",
            "            <label class='form-check-label' for='input-rating-4'>4</label>",
            "        </div>",
            "        <div class='form-check form-check-inline'>",
            "            <input class='form-check-input' type='radio' name='rating' id='input-rating-5' value='5'>",
            "            <label class='form-check-label' for='input-rating-5'>5</label>",
            "        </div>",
            "    </div>",
            "    <div class='mb-3'>",
            "        <label for='input-review' class='form-label'>Review</label>",
            "        <input type='text' class='form-control' id='input-review' name='review' rows='3'>",
            "    </div>",
            "    <button type='submit' class='btn btn-primary'>Submit</button>",
            "</form>",
        ].join("\n");
        return form;
    }

    function buildMovieCard(movie) {
        const card = [
            "<div class='card'>",
            "    <div class='card-body'>",
            "        <h5 class='card-title'>" + movie["title"] + "</h5>",
            "        <h6 class='card-subtitle mb-2 text-muted'>" + movie["release_date"] + "</h6>",
            "        <p class='card-text'>" + movie["description"] + "</p>",
            "        <p class='card-text'>Directed: " + movie["director"] + "</p>",
            "        <p class='card-text'>Written: " + movie["writer"] + "</p>",
            "        <p class='card-text'>Release Date: " + movie["release_date"] + "</p>",
            "        <p class='card-text'>Category: " + movie["category"] + "</p>",
            "        <p class='card-text'>Runtime: " + movie["runtime"] + "</p>",
            "    </div>",
            "</div>"
        ].join("\n");
        return card;
    }

    function buildReviews(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "movie/review/" + id, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const rows = JSON.parse(xhttp.responseText)[0];
                for (const row in rows) {
                    console.log(rows[row]);
                    $("#reviews").append(buildReviewCard(rows[row]));
                }
            }
        }
    }

    function buildPage(id) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "movie/" + id, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const row = JSON.parse(xhttp.responseText)[0];
                $("#movie").append(buildMovieCard(row));
                $("#add-review").append(buildReviewForm(row["id"]));
                buildReviews(id);
            }
        }
    }

    const params = new URLSearchParams(window.location.search);
    buildPage(params.get("id"));
});