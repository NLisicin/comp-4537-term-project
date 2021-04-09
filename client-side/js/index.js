$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";
    const CATEGORIES = ["movie", "show", "game"];

    // Build card element from row data
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

    // GET from server
    function buildPage() {
        for (let i = 0; i < CATEGORIES.length; i++) {
            const category = CATEGORIES[i];
            console.log("Category: " + category);
            const xhttp = new XMLHttpRequest();
            console.log("GET: " + ROOT + category);
            xhttp.open("GET", ROOT + category, true)
            xhttp.send();
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    const rows = JSON.parse(xhttp.responseText);
                    console.log(rows);
                    if (rows.length < 1) {
                        $("#" + category).append("There are no entries for this category.");
                    } else {
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            console.log(row);
                            $("#" + category).append(buildCard(category, row));
                        }
                    }
                }
            }
        }
    }

    buildPage();
});