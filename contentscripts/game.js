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

    // change title patron displayed on the right of the chessboard
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

        let index;
        if(playerElements[0].textContent.includes(usersName)){ 
            index = 0;
        } else { index = 1}

        if(playerdivs[index].querySelector('span.utitle')){ // when user already has a title just change that
            playerdivs[index].querySelector('span.utitle').textContent = fakeTitle;
        }
        else{ // else fake a new title
            let innerHTML = `<span class="utitle">${fakeTitle}</span>&nbsp;`;
            playerdivs[index].innerHTML = innerHTML + playerdivs[index].innerHTML;
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

    // lastly fake the rating according to the current gameMode (e.g. blitz) and the configured 
    // rating for that mode.

    // figure out if it is bullet, rapid, blitz classical or correspondence
    const metaTags = document.querySelectorAll('meta');
    let contentString = null;
    for (const metaTag of metaTags) {
        const content = metaTag.getAttribute('content');
        if (content && content.includes('game of chess.')) {
            contentString = content;
            break; 
        }
    }
    let words = contentString.split(' ');
    let gameIndex = words.indexOf("game");
    let gameMode = words[gameIndex - 2].toLowerCase();

    if(["bullet", "blitz", "rapid", "classical", "correspondence"].includes(gameMode)){
        chrome.storage.sync.get([gameMode], function(result) {
            if(result[gameMode]) {
                let fakeRating = result[gameMode];
                if(fakeRating) {
                    // faking rating displayed to the right of the board
                    document.querySelector('.ruser-bottom rating').textContent = fakeRating;

                    // faking rating displayed on the meta info above chat
                    let div = document.querySelector("div.game__meta__players");
                    let playerdivs = div.querySelectorAll('div');
                    let playerElements = div.querySelectorAll(".user-link");
                    const regex = /\((\d+)\)/;  // for replacing the number between "(" and ")"
                    if(playerElements[0].textContent.includes(usersName)){
                        let inner = playerdivs[0].innerHTML.replace(regex, `(${fakeRating})`);
                        playerdivs[0].innerHTML = inner;
                    }
                    else{
                        let inner = playerdivs[1].innerHTML.replace(regex, `(${fakeRating})`);
                        playerdivs[1].innerHTML = inner;
                    }
                }
            }
        });
    }

})();
