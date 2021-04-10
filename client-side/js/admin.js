$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";

    // Build table row element from row data
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

    // GET from server
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
});