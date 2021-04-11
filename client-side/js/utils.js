const ROOT = "https://rachellaurat.com/api/v1/";
const API_KEY = "?apiKey=shoopapikey";
const CATEGORIES = ["movie", "show", "game"];

const validationRules = (submitFunction) => {
    return {
        rules: {
            seasons: {required: true, number: true}
        },

        messages: {
            seasons: {number: "Must be a number"}
        },

        submitHandler: (form) => form.submitFunction
    }
}