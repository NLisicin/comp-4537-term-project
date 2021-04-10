$(document).ready(function () {
    const ROOT = "https://rachellaurat.com/api/v1/";

    // Set up form behaviour
    function setUpForm(category) {
        $("#new-" + category + "-form").attr("action", ROOT + category);

        const form = $("#new-" + category + "-form");
        $("#" + category + "-submit").click(() => {   
            $.ajax({
                type: form.attr("method"),
                url: form.attr("action"),
                data: form.serialize(),
                success: () => {
                    alert("Item added");
                    window.location.reload();
                },
                error: () => {
                    alert("Error adding item");
                }
            });
            return false;
        });
    }

    setUpForm("movie");
    setUpForm("show");
    setUpForm("game");
});