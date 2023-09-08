// executed when https://lichess.org/@/* is called
// this script manipulates the users profile page
(() => {
    
    // show patron symbol on profile
    chrome.storage.sync.get(['fakePatron'], (result) => {
        if (result.fakePatron) { // if fakePatron is enabled
            const checkIsMyProfile = () => {
                let isMyProfile = document.querySelector('.user-actions.btn-rack a[title="Edit profile"]');
                if (isMyProfile) {
                    // this means it is the user's profile
                    let elm = document.querySelector("span.online.user-link");
                    if (elm) {
                        elm.querySelector("i.line").classList.add("patron");
                    }
                } else {
                    // Re-check after a short delay
                    setTimeout(checkIsMyProfile, 100);
                }
            };
            checkIsMyProfile(); // Start checking immediately
        }
    });

    // show title on profile
    chrome.storage.sync.get(['fakeTitle'], (result) => {
        if(result.fakeTitle){ // if fakeTitle is enabled
            let userLink = document.querySelector('.online.user-link');
            if (userLink) {
                let newTextElement = document.createElement('span');
                newTextElement.classList.add('utitle');
                newTextElement.innerHTML = `${result.fakeTitle}&nbsp;`;
                userLink.insertBefore(newTextElement, userLink.querySelector('i.line').nextSibling);
            }
        }
    });

    
    
})();
