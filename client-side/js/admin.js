$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";
    const CATEGORIES = {
        "Movies": "movies",
        "TV Shows": "shows",
        "Video Games": "games"
    }

    function buildMovieForm() {
        const form = [
            "<form method='POST' action='/movie'>",
            "   <div class='mb-3'>",
            "      <label for='input-title' class='form-label'>Title</label>",
            "      <input type='text' class='form-control' id='input-title' name='title'>",
            "   </div>",
            "   <div class='mb-3'>",
            "      <label for='input-director' class='form-label'>Director</label>",
            "      <input type='text' class='form-control' id='input-director' name='director'>",
            "   </div>",
            "   <div class='mb-3'>",
            "      <label for='input-writer' class='form-label'>Writer</label>",
            "      <input type='text' class='form-control' id='input-writer' name='writer'>",
            "   </div>",
            "   <div class='mb-3'>",
            "      <label for='input-date' class='form-label'>Release Date</label>",
            "      <input type='text' class='form-control' id='input-date' name='date'>",
            "   </div>",
            "   <div class='mb-3'>",
            "      <label for='input-category' class='form-label'>Category</label>",
            "      <input type='text' class='form-control' id='input-category' name='category'>",
            "   </div>",
            "   <div class='mb-3'>",
            "      <label for='runinput-time' class='form-label'>Runtime</label>",
            "      <input type='text' class='form-control' id='input-runtime' name='runtime'>",
            "   </div>",
            "   <div class='mb-3'>",
            "      <label for='input-description' class='form-label'>Description</label>",
            "      <textarea type='text' class='form-control' id='input-description' name='description' rows='3'></textarea>",
            "   </div>",
            "   <button type='submit' class='btn btn-primary'>Submit</button>",
            "</form>"
        ].join("\n");
        return form;
    }

    function buildForm(category) {
        $("#new-item-form").empty();
        switch (category) {
            case "movies":
                $("#new-item-form").append(buildMovieForm());
        }
    }

    function buildRow(method, endpoint, count) {
        const row = [
            "<tr>",
            "   <th scope='row'>" + method + "</th>",
            "   <td>" + endpoint + "</td>",
            "   <td>" + count + "</td>",
            "</tr>"
        ].join("\n");
        return row;
    }

    function getEndpointStats() {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + "admin", true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const rows = JSON.parse(xhttp.responseText);
                for (const key of Object.keys(rows)) {
                    const row = rows[key];
                    $("#endpoint-table-body").append(buildRow(
                        row["method"],
                        row["endpoint"],
                        row["count"]
                    ));
                }
            }
        }
    }

    getEndpointStats();

    $(".dropdown-menu li a").on("click", (value) => {
        let category = CATEGORIES[value.target.innerHTML];
        buildForm(category);
    });
});