$(document).ready(() => {

    // POST item
    const submitForm = (form, category) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", ROOT + category, true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(form.serialize());
        xhttp.onreadystatechange = () => {
            console.log(xhttp.status);
            if (xhttp.readyState == 4 && xhttp.status == 201) {
                alert("Added " + category);
                form[0].reset();
            }
        }
    }

    for (let i = 0; i < CATEGORIES.length; i++) {
        const category = CATEGORIES[i];
        const form = $("#new-" + category + "-form");

        form.submit((e) => {
            e.preventDefault();
            submitForm(form, category);
        });
    }
});