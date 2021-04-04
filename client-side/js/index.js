$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";
    const CATEGORIES = {
        "Movies": "movie",
        "TV Shows": "show",
        "Video Games": "game"
    }

    function buildCard(category, row) {
        const card = [
            "<br/>",
            "<a href='./" + category + ".html?id=" + row["id"] + "'>",
            "    <div class='card'>",
            "        <div class='card-body'>",
            "            <h5 class='card-title'>" + row["title"] + "</h5>",
            "            <h6 class='card-subtitle mb-2 text-muted'>" + row["release_date"] + "</h6>",
            "            <p class='card-text'>" + row["description"] + "</p>",
            "        </div>",
            "    </div>",
            "</a>"
        ].join("\n");
        return card;
    }

    function buildPage(category) {
        $("#cards").empty();
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", ROOT + category, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const rows = JSON.parse(xhttp.responseText);
                for (const row in rows) {
                    console.log(rows[row]);
                    $("#cards").append(buildCard(category, rows[row]));
                }
            }
        }
    }

    $(".dropdown-menu li a").on("click", (value) => {
        let category = CATEGORIES[value.target.innerHTML];
        buildPage(category);
    });
});