$(document).ready(() => {

    // POST item
    const submitForm = (form, category) => {
        const XHTTP = new XMLHttpRequest();
        XHTTP.open("POST", ROOT + category + API_KEY, true);
        XHTTP.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        XHTTP.send(form.serialize());
        XHTTP.onreadystatechange = () => {
            if (XHTTP.readyState == 4 && XHTTP.status == 201) {
                alert("Added " + category);
                form[0].reset();
            }
        }
    }

    for (let i = 0; i < CATEGORIES.length; i++) {
        const CATEGORY = CATEGORIES[i];
        const FORM = $("#new-" + CATEGORY + "-form");

        const SUBMIT_HANDLER = FORM.submit((e) => {
            e.preventDefault();
            submitForm(FORM, CATEGORY);
        });

        FORM.validate(validationRules(SUBMIT_HANDLER));
    }
});