const entryForm = document.getElementById('entryForm');
const entriesSection = document.querySelector('#entries');
const entryTextbox = document.querySelector('.entry-textbox');
const entriesNav = document.querySelector('.entries-nav');
const select = document.querySelector("#old-entry-choices");
let entryNumber = 1;

let cachedEntries = window.localStorage; // save key,value pairs even when a session is closed
const maxCachedEntries = 10;

function handleForm(event) {
    event.preventDefault(); // Prevent page reload

    const entryDiv = document.createElement('div');
    const entryString = entryTextbox.value;
    entryDiv.style.display = 'none';
    entryDiv.classList.add('single-entry');

    // Adding item to local storage, using a randomly generated password
    
    let entryNotChosen = true;

    // If a user selected an entry number in the drop-down menu, save the diary entry there.
    if (parseInt(select.value)) {
        cachedEntries.setItem((select.value - 1), entryString);
        entryDiv.innerText = entryString + " \nCached Entry #" + select.value;
        entryNotChosen = false;
    }
    
    while (entryNotChosen) {
        let cachePassword = Math.floor(Math.random() * maxCachedEntries)
        // To randomly create a password
        if (cachedEntries.length === maxCachedEntries) { // override old entries at max storage
            cachedEntries.setItem(cachePassword, entryString);
            entryDiv.innerText = entryString + " \nCached Entry #" + (cachePassword + 1);
            break;
        } else if (cachedEntries.getItem(cachePassword) === null) {
            // Problem: what if for some reason, the randomly generated number never turns out to be an empty space?
            // > Not a problem for SMALL maxCachedEntries values.
            cachedEntries.setItem(cachePassword, entryString);
            entryDiv.innerText = entryString + " \nCached Entry #" + (cachePassword + 1);
            break;
        }
        cachePassword = Math.floor(Math.random() * maxCachedEntries + 1)
    }

    entriesSection.appendChild(entryDiv);

    entryTextbox.value = "";

    const displayEntryButton = document.createElement('button')
    displayEntryButton.classList.add("display-entry-button")
    displayEntryButton.innerText = entryNumber;
    entriesNav.appendChild(displayEntryButton)
    entryNumber++;

    displayEntryButton.addEventListener('click', function() {
        const allEntries = document.querySelectorAll('.single-entry');

        for (let i = 0; i < allEntries.length; i++) {
            allEntries[i].style.display = 'none'
        }

        // local storage testing (printing data)
        for (let i=0; i < maxCachedEntries; i++) {
            console.log((i+1) + ": " + cachedEntries.getItem(i))
        }

        entryDiv.style.display = 'block'
    })

}

entryForm.addEventListener('submit', handleForm)

// Not on a submit, but rather when you click view old entry.
const viewOldEntryButton = document.querySelector('.old-entries-button')
const outputOldEntry = document.createElement('p')
outputOldEntry.classList.add('saved-entry');

viewOldEntryButton.addEventListener('click', function () {
    const entryChoice = select.value;
    if (parseInt(entryChoice)) {
        outputOldEntry.textContent = "Saved entry #" + entryChoice + ": " + cachedEntries.getItem(entryChoice - 1);
        outputOldEntry.style.display = 'block';
    } else {
        outputOldEntry.style.display = 'none';
    }
})

document.body.appendChild(outputOldEntry)

// Populating the selector
const option = document.createElement("option");
option.textContent = "No entry choice";
select.appendChild(option);

for (let i = 0; i < maxCachedEntries; i ++) {
    const option_i = document.createElement("option");
    option_i.textContent = i + 1;
    select.appendChild(option_i);
}

