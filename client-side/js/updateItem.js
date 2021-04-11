$(document).ready(() => {

    // PUT item
    const submitForm = (form, category, id) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("PUT", ROOT + category + "/" + id + API_KEY, true);
        XHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHTTP.send(form.serialize());
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 200) {
                alert("Updated " + category);
                window.location.replace("./item.html?category=" + category + "&id=" + id);
            }
        }
    }

    // GET item data
    const buildPage = (form, category, id) => {
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
                form.show();
            } else if ((XHTTP.readyState == 4 && (XHTTP.status == 400 || XHTTP.status == 400))) {
                $("#body").append("Invalid item ID.");
            }
        }
    }

    const PARAMS = new URLSearchParams(window.location.search);
    const CATEGORY = PARAMS.get("category");
    const ID = PARAMS.get("id");
    const FORM = $("#update-" + CATEGORY + "-form");

    buildPage(FORM, CATEGORY, ID);
    
    const SUBMIT_HANDLER = FORM.submit((e) => {
        e.preventDefault();
        submitForm(FORM, CATEGORY, ID);
    });

    FORM.validate(validationRules(SUBMIT_HANDLER));

    $("[id$='-cancel']").click(() => window.history.back());
});