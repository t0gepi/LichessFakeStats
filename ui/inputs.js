const ratingInputs = document.querySelectorAll(".rating");
ratingInputs.forEach(function(input) {
    input.addEventListener("input", function() {
        input.value = input.value.replace(/[^0-9]/g, '');
        if (input.value.length > 4) {
            input.value = input.value.slice(0, 4);
        }
    });
});