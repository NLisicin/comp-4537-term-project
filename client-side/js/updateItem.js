$(document).ready(() => {

    // PUT item
    const submitForm = (form, category, id) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", ROOT + category + "/" + id + API_KEY, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(form.serialize());
        xhttp.onreadystatechange = () => {
            console.log(xhttp.status);
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                alert("Updated " + category);
                window.location.replace("./item.html?category=" + category + "&id=" + id);
            }
        }
    }

    // GET item data
    const buildPage = (category, id) => {
        console.log(category);
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("GET", ROOT + category + "/" + id + API_KEY, true)
        XHTTP.send();
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                const ROW = JSON.parse(XHTTP.responseText)[0];
                $.each(ROW, (key, value) => {
                    if (key === "description") {
                        $("[name=desc]").val(value);
                    } else {
                        $("[name=" + key + "]").val(value);
                    }
                });
            } else if ((XHTTP.readyState == 4 && (XHTTP.status == 400 || XHTTP.status == 400))) {
                $("#body").append("Invalid item ID.");
            }
        }
    }

    const PARAMS = new URLSearchParams(window.location.search);
    const CATEGORY = PARAMS.get("category");
    const ID = PARAMS.get("id");
    const FORM = $("#update-" + CATEGORY + "-form");

    buildPage(CATEGORY, ID);
    
    FORM.show();
    FORM.submit((e) => {
        e.preventDefault();
        submitForm(FORM, CATEGORY, ID);
    });

    $("[id$='-cancel']").click(() => window.history.back());
});