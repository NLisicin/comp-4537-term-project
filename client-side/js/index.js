$(document).ready(() => {

    // Build card element from row data
    const buildCard = (category, row) => {
        return "<br/>" +
            "<a href='./item.html?category=" + category + "&id=" + row["id"] + "'>" +
            "    <div class='card'>" +
            "        <div class='card-body'>" +
            "            <h5 class='card-title'>" + row["title"] + "</h5>" +
            "            <h6 class='card-subtitle mb-2 text-muted'>" + row["release_date"] + "</h6>" +
            "            <p class='card-text'>" + row["description"] + "</p>" +
            "        </div>" +
            "    </div>" +
            "</a>"
    }

    // GET item data
    const buildPage = () => {
        for (let i = 0; i < CATEGORIES.length; i++) {
            const CATEGORY = CATEGORIES[i];
            const XHTTP = new XMLHttpRequest();
            XHTTP.open("GET", ROOT + CATEGORY + API_KEY, true)
            XHTTP.send();
            XHTTP.onreadystatechange = () => {
                if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                    const ROWS = JSON.parse(XHTTP.responseText);
                    if (ROWS.length < 1) {
                        $("#" + CATEGORY).append("There are no entries for this category.");
                    } else {
                        for (let i = 0; i < ROWS.length; i++) {
                            const ROW = ROWS[i];
                            $("#" + CATEGORY).append(buildCard(CATEGORY, ROW));
                        }
                    }
                }
            }
        }
    }

    buildPage();
});