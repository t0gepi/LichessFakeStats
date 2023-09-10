// when save button is cliked
$("#saveButton").on("click", async () => {

    async function saveStats() {
        // saving faketitle
        var selectedValue = $("#fakeTitleSelect").val();
        await new Promise(resolve => {
            chrome.storage.sync.set({ fakeTitle: selectedValue }, function() {
                console.log("Stored title: " + selectedValue);
                resolve();
            });
        });

        // saving switch states (fakepatron, faketrophies...)
        await Promise.all($('.switch').map(async function() {
            var switchElement = $(this);
            var switchId = switchElement.attr('id');
            var isChecked = switchElement.find('input[type="checkbox"]').prop('checked');
            return new Promise(resolve => {
                chrome.storage.sync.set({ [switchId]: isChecked }, function() {
                    console.log("Stored " + switchId + ": " + isChecked);
                    resolve();
                });
            });
        }).get());

        // saving ratings
        await Promise.all($('.rating').map(async function() {
            let input = $(this);
            let inputId = input.attr('id');
            let value = input.val();
            return new Promise(resolve => {
                chrome.storage.sync.set({ [inputId]: value }, function() {
                    console.log("Stored " + inputId + ": " + value);
                    resolve();
                });
            });
        }).get());

    }

    console.log("\nSaving stats...\n");
    await saveStats();
    console.log("\nFinished saving stats.\n");
});



// when extension loads:
(async() => {
    async function loadStats() {
        // Load saved title from chrome storage
        await new Promise(resolve => {
            chrome.storage.sync.get(["fakeTitle"], function(result) {
                var storedValue = result.fakeTitle;
                if (storedValue) {
                    $("#fakeTitleSelect").val(storedValue);
                    console.log("Loaded faketitle: " + storedValue);
                }
                resolve();
            });
        });
    
        // Load saved switch states
        await Promise.all($('.switch').map(async function() {
            var switchElement = $(this);
            var switchId = switchElement.attr('id');
            return new Promise(resolve => {
                chrome.storage.sync.get([switchId], function(result) {
                    if (result[switchId]) {
                        switchElement.find('input[type="checkbox"]').prop('checked', true);
                        console.log("Loaded " + switchId + ": true");
                    } else {
                        console.log("Loaded " + switchId + ": false");
                    }
                    resolve();
                });
            });
        }).get());
    
        // Load ratings
        await Promise.all($('.rating').map(async function() {
            let input = $(this);
            let inputId = input.attr('id');
            return new Promise(resolve => {
                chrome.storage.sync.get([inputId], function(result) {
                    if (result[inputId]) {
                        input.val(result[inputId]);
                        console.log("Loaded " + inputId + ": " + result[inputId]);
                    }
                    resolve();
                });
            });
        }).get());
    
    }

    console.log('Loading stats...\n\n');
    await loadStats();
    console.log('\nFinished loading stats.\n');
})();

// Clear Button functionality
$('#clearButton').on('click', async () => {
    console.log('\nResetting stats...');
    $("#fakeTitleSelect").val($("#fakeTitleSelect option:first").val());
    $('.switch').each(function() {
        $(this).find('input[type="checkbox"]').prop('checked', false);
    });
    $('.rating').each(function() {
        $(this).val('');
    })
    console.log('All stats have been reset.\n');
});


