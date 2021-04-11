$(document).ready(() => {

    // Build table row element from row data
    const buildRow = (method, endpoint, count) => {
        return "<tr>" +
            "   <th scope='row'>" + method + "</th>" +
            "   <td>" + endpoint + "</td>" +
            "   <td>" + count + "</td>" +
            "</tr>";
    }

    // GET endpoint stats
    const getEndpointStats = () => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("GET", ROOT + "admin" + API_KEY, true);
        XHTTP.send();
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                const ROWS = JSON.parse(XHTTP.responseText);
                for (let i = 0; i < ROWS.length; i++) {
                    const ROW = ROWS[i];
                    $("#endpoint-table-body").append(buildRow(
                        ROW["method"],
                        ROW["endpoint"],
                        ROW["count"]
                    ));
                }
            }
        }
    }

    // POST authentication form
    const authenticate = (form) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("POST", ROOT + "login" + API_KEY, true);
        XHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHTTP.send(form.serialize());
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                getEndpointStats();
                form.hide();                
                $("#endpoint-table").show();                
            } else if (XHTTP.readyState == 4 && XHTTP.status == 401) {
                alert("Invalid credentials");
                form[0].reset();
            }
        }
    }

    const FORM = $("#authentication-form");
    
    FORM.submit((e) => {
        e.preventDefault();
        authenticate(FORM);
    });
});