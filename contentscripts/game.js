var currentURL = window.location.href;
var gameRegex = /^https:\/\/lichess\.org\/[a-zA-Z0-9]{8,12}$/;
// the regex assures that there is a game of the user being displayed

(async () => {
    if (!gameRegex.test(currentURL)) {
        return; // script only manipulates the users game page
    }

    let fakeTitle;
    let fakePatron;

    async function getFakeTitle() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['fakeTitle'], (result) => {
                fakeTitle = result.fakeTitle;
                resolve();
            });
        });
    }

    async function getFakePatron() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['fakePatron'], (result) => {
                fakePatron = result.fakePatron;
                resolve();
            });
        });
    }

    await Promise.all([getFakeTitle(), getFakePatron()]); // wait for data

    
    // now start manipulating

    // change title and patron displayed on the right of the chessboard
    let bottom_username = document.querySelector(".ruser-bottom a");
    let usersName;
    
    usersName = bottom_username.textContent;
    if(fakeTitle) {
        let manipulated = `<span class="utitle">${fakeTitle}</span>&nbsp;${usersName}`;
        bottom_username.innerHTML = manipulated;
    }
    if(fakePatron) {
        document.querySelector(".ruser-bottom i.line").classList.add("patron");
    }
    

    // change title displayed in meta info above chat.
    if(fakeTitle) {
        let div = document.querySelector("div.game__meta__players");
        let playerdivs = div.querySelectorAll('div');
        let playerElements = div.querySelectorAll(".user-link");

        if(playerElements[0].textContent.includes(usersName)){
            let nameAndRating = playerElements[0].textContent.split(' ');
            let innerHTML = `<span class="utitle">${fakeTitle}</span>&nbsp;<a class="user-link ulpt" href="/@/${nameAndRating[0]}">${nameAndRating[0]} ${nameAndRating[1]}</a>`
            playerdivs[0].innerHTML = innerHTML;
        }
        else{
            let nameAndRating = playerElements[1].textContent.split(' ');
            let innerHTML = `<span class="utitle">${fakeTitle}</span>&nbsp;<a class="user-link ulpt" href="/@/${nameAndRating[0]}">${nameAndRating[0]} ${nameAndRating[1]}</a>`
            playerdivs[1].innerHTML = innerHTML;
        }
    }


    // change title & patron in powerTip. The powerTip is the popup that appears,
    // when hovering over a players username.
    const observer = new MutationObserver(mutations => {
        var elm = document.getElementById("powerTip");
        if (elm && elm.style.display == 'block') {
            // disconnect to prevent that the below DOM changes fire new events into this observer
            // that would cause an infinite loop.
            observer.disconnect();
            var a_username = elm.querySelector('a.user-link');
            if(a_username && a_username.textContent.includes(usersName)){
                let innerHTML = '<i class="line"></i>';
                if(fakeTitle) {
                    innerHTML += `<span class="utitle">${fakeTitle}</span>&nbsp;`;
                }
                innerHTML += usersName;
                a_username.innerHTML = innerHTML;
                if(fakePatron){
                    a_username.querySelector('i.line').classList.add('patron');
                }
            }
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });



})();



