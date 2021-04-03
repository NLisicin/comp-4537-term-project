$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";
    const CATEGORIES = {
        "Movies": "movie",
        "TV Shows": "show",
        "Video Games": "game"
    }

    function buildCard(title, year, description) {
        const card = [
            "<br/>",
            "<a href='#'>",
            "    <div class='card'>",
            "        <div class='card-body'>",
            "            <h5 class='card-title'>" + title + "</h5>",
            "            <h6 class='card-subtitle mb-2 text-muted'>" + year + "</h6>",
            "            <p class='card-text'>" + description + "</p>",
            "        </div>",
            "    </div>",
            "</a>"
        ].join("\n");
        return card;
    }

    function buildPage(category) {
        $("#cards").empty();
        for (let i = 0; i < 5; i++) {
            $("#cards").append(buildCard("Movie " + i, "200" + i, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum metus lacus, eu scelerisque lectus facilisis id. Aenean aliquam turpis et pulvinar molestie."));
        }
        const xhttp = new XMLHttpRequest();
        console.log(ROOT + category);
        xhttp.open("GET", ROOT + category, true)
        xhttp.send();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const rows = JSON.parse(xhttp.responseText);
                for (const row in rows) {
                    console.log(row);
                    $("#cards").append(buildCard(
                        row["title"],
                        row["year"],
                        row["description"]
                    ));
                }
            }
        }
    }

    $(".dropdown-menu li a").on("click", (value) => {
        let category = CATEGORIES[value.target.innerHTML];
        buildPage(category);
    });
});