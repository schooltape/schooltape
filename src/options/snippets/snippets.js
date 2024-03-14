// add snippet listener
document.getElementById('snippet-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let url = document.getElementById("snippet-input").value;
    if (url) {
        console.log(url);

        // if is link, send request
        if (url.startsWith("http") && url.includes("gist.github.com")) {
            console.log("Downloading snippet...");
            // send request to get snippet
            fetch(url + "/raw")
                .then(response => response.text())
                .then(cssSnippet => {
                    console.log(cssSnippet);
                    let nameMatch = cssSnippet.match(/\/\*\s*name:\s*(.*?)\s*\*\//);
                    let descriptionMatch = cssSnippet.match(/\/\*\s*description:\s*(.*?)\s*\*\//);
                    let snippetName = nameMatch ? nameMatch[1] : null;
                    let snippetDescription = descriptionMatch ? descriptionMatch[1] : null;
                    let sections = url.split("/");
                    let snippetAuthor = sections[3];
                    let snippetID = sections[sections.length - 1].split(".")[0];

                    // example URL: https://gist.githubusercontent.com/42Willow/98435ecb3d871ecf14659936cdf36105
                    console.log(`author: ${snippetAuthor}`); // Outputs: 42Willow
                    console.log(`id: ${snippetID}`); // Outputs: hide-iframes
                    console.log(`name: ${snippetName}`); // Outputs: Hide homepage iframe
                    console.log(`description: ${snippetDescription}`); // Outputs: Useful for use with dark mode themes

                    let snip = {
                        [snippetID]: {
                            "name": snippetName,
                            "author": snippetAuthor,
                            "description": snippetDescription,
                        }
                    }

                    if (Object.values(snip[snippetID]).includes(null)) {
                        alert("This snippet is missing a name or description");
                        return;
                    }
                    console.log(snip);

                    // modify the settings to add to list of userSnippets
                    chrome.storage.local.get(['settings'], function(settingsData) {
                        let settings = settingsData.settings;
                        // if not already installed
                        if (settings.userSnippets.some(e => e[snippetID])) {
                            alert("This snippet is already installed.");
                            return;
                        }
                        settings.userSnippets.push(snip);
                        chrome.storage.local.set({"settings": settings}, function() {
                            console.log(`Installed snippet ${snip}`);
                        });
                        addUserSnippets();
                    });
                });
        } else if (url.startsWith("http") && url.includes("gist") && url.includes("raw")) {
            alert("Please use the main URL of the Gist, not the raw URL.");
        }
        else {
            alert("Please enter a valid URL.");
        }
    }
});



fetch("/snippets/snippets.json")
    .then(response => response.json())
    .then(data => {
        // console.log(data);

        // add snippets from the json file
        addSnippets(data);

        // add user installed snippets
        addUserSnippets();
    }
);



// Add snippets to the page
function addSnippets(data) {
    chrome.storage.local.get(['settings'], function(settingsData) {
        let options = document.querySelector(".snippets-container");
        let snippets = Object.entries(data);
        // console.log(snippets);
        // console.log(settingsData);
        snippets.forEach((snippet) => {
            // console.log(snippet);
            let snippetId = snippet[0];
            let snippetName = snippet[1].name;
            let snippetDescription = snippet[1].description;
            let snippetToggled = settingsData.settings.enabledSnippets.includes(snippetId);
            let option = document.createElement("div");
            option.classList.add("my-4");
            option.classList.add("group");
            option.innerHTML = `
                <label class="relative flex justify-between items-center group py-2 text-xl text-text">
                    <h4 class="text-text">${snippetName}</h4>
                    <input snippet-id="${snippetId}" ${snippetToggled ? 'checked' : ''} type="checkbox" class="snippet-toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
                    <span class="w-11 h-5 flex items-center flex-shrink-0 ml-4 p-1 bg-red rounded-lg duration-500 ease-in-out peer-checked:bg-green after:w-3 after:h-3 after:bg-base after:rounded-lg after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
                </label>
                <div class="text-subtext0 group-hover:text-subtext1">${snippetDescription}</div>
            `;
            options.appendChild(option);
        });
    });
}

function addUserSnippets() {
    chrome.storage.local.get(['settings'], function(settingsData) {
        let settings = settingsData.settings;
        let snippets = settings.userSnippets;
        let options = document.querySelector(".user-snippets-container");
        // clear the container
        options.innerHTML = "";
        // console.log(snippets);
        if (snippets.length > 0) {
            snippets.forEach((snippet) => {
                let snippetId = Object.keys(snippet)[0];
                let snippetName = snippet[snippetId].name;
                let snippetDescription = snippet[snippetId].description;
                let snippetURL = `https://gist.github.com/${snippet[snippetId].author}/${snippetId}`;
                let option = document.createElement("div");
                let snippetToggled = settingsData.settings.enabledSnippets.includes(snippetId);
                option.classList.add("my-4");
                option.classList.add("group");
                option.innerHTML = `
                    <label class="relative flex justify-between items-center group py-2 text-xl text-text">
                        <h4 class="text-text">${snippetName}</h4>
                        <input snippet-id="${snippetId}" ${snippetToggled ? 'checked' : ''} type="checkbox" class="snippet-toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
                        <span class="w-11 h-5 flex items-center flex-shrink-0 ml-4 p-1 bg-red rounded-lg duration-500 ease-in-out peer-checked:bg-green after:w-3 after:h-3 after:bg-base after:rounded-lg after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
                    </label>
                    <div class="text-subtext0 group-hover:text-subtext1 mb-2">${snippetDescription}</div>
                    <a href="${snippetURL}" target="_blank"><button class="text-xs rounded-md px-1 py-0.5 bg-base text-text hover:text-crust hover:bg-pink">Gist</button></a>
                    <button snippet-id="${snippetId}" class="remove-snippet text-xs rounded-md px-1 py-0.5 bg-base text-text hover:text-crust hover:bg-red">Remove</button>
                `;
                options.appendChild(option);
            });
        }

        // setup toggle listeners
        let snippetToggles = document.querySelectorAll(".snippet-toggle");

        snippetToggles.forEach((toggle) => {
            // console.log(toggle);
            toggle.addEventListener("click", toggleClicked);
        });

        // setup remove listeners
        let removeButtons = document.querySelectorAll(".remove-snippet");

        removeButtons.forEach((button) => {
            button.addEventListener("click", removeClicked);
        });
    });
}

function toggleClicked(event) {
    // console.log(event.target);
    let snippetId = event.target.getAttribute("snippet-id");
    if (event.target.checked) {
        installSnippet(snippetId);
    } else {
        uninstallSnippet(snippetId);
    }
}

function removeClicked(event) {
    let snippetId = event.target.getAttribute("snippet-id");
    chrome.storage.local.get(['settings'], function(settingsData) {
        let settings = settingsData.settings;
        let index = settings.enabledSnippets.indexOf(snippetId);
        if (index !== -1) {
            settings.enabledSnippets.splice(index, 1);
        }
        settings.userSnippets.splice(settings.userSnippets.findIndex(e => e[snippetId]), 1);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Removed snippet ${snippetId}`);
        });
        addUserSnippets();
    });
}

function installSnippet(snippetId) {
    chrome.storage.local.get(['settings'], function(settingsData) {
        let settings = settingsData.settings;
        settings.enabledSnippets.push(snippetId);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Installed snippet ${snippetId}`);
        });
    });
}
function uninstallSnippet(snippetId) {
    chrome.storage.local.get(['settings'], function(settingsData) { 
        let settings = settingsData.settings;
        settings.enabledSnippets.splice(settings.enabledSnippets.indexOf(snippetId), 1);
        chrome.storage.local.set({"settings": settings}, function() {
            console.log(`Uninstalled snippet ${snippetId}`);
        });
    });
}
