const ratingInputs = document.querySelectorAll(".rating");
ratingInputs.forEach(function(input) {
    input.addEventListener("input", function() {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value.length > 4) {
            input.value = input.value.slice(0, 4);
        }
    });
});


$(document).ready(function() {
    $("#saveButton").click(function() {
        $("#saveSuccess").fadeIn();
        setTimeout(function() {
            $("#saveSuccess").fadeOut();
        }, 4000);
    });
    $("#clearButton").click(function() {
        $("#clearSuccess").fadeIn();
        setTimeout(function() {
            $("#clearSuccess").fadeOut();
        }, 4000);
    });
});









