//setting game name
let date = new Date().getFullYear();
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Ziad &copy ${date}`

//setting game options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;
let pointer = 0;

document.querySelector(".pointer span").innerHTML = pointer;

let massageAera = document.querySelector(".massage");
//Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);
//Get Radnom Words
// URL of the random words API
const apiUrl = "https://random-word-api.herokuapp.com/word?number=100";

// متغير لتخزين الكلمة المخمنة
let wordToGuess = "";

// Function to get random words from the API and filter them by length
async function getRandomSixLetterWord() {
    try {
        const response = await fetch(apiUrl);
        const words = await response.json();
        // Filter words to get only those with 6 letters
        const sixLetterWords = words.filter(word => word.length === 6);
        if (sixLetterWords.length > 0) {
            // Pick a random word from the filtered list
            return sixLetterWords[Math.floor(Math.random() * sixLetterWords.length)].toLowerCase();
        } else {
            throw new Error("No six-letter words returned from the API");
        }
    } catch (error) {
        console.error("Error fetching the words:", error);
        return null;
    }
}

// Fetch and log the random six-letter word
getRandomSixLetterWord().then(word => {
    if (word) {
        wordToGuess = word;
        console.log(wordToGuess);
        // يمكنك الآن استخدام wordToGuess في البرنامج الخاص بك
    } else {
        console.log("Failed to fetch a six-letter word.");
    }
});




function generateInput() {
    const inputsContainer = document.querySelector(".inputs");
    for (let i = 1; i <= numbersOfTries; i++ ) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i !== 1) tryDiv.classList.add("disabled-inputs");
        //create inputs
        for (let j = 1; j <= numbersOfLetters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        };

        inputsContainer.appendChild(tryDiv);
    };
    inputsContainer.children[0].children[1].focus();
    
    //Disable All Inputs
    const inputInDisableDiv = document.querySelectorAll(".disabled-inputs input");
    inputInDisableDiv.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) =>{
        // conver input to uppercase
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
            //Index number
            const nextInput = inputs[index + 1];
            if(nextInput) nextInput.focus();
        });
        input.addEventListener("keydown", function(event) {
            const currentIndex = Array.from(inputs).indexOf(event.target); 
            if (event.key === "ArrowRight") {
                const nextInput = currentIndex + 1;
                if (nextInput < inputs.length) inputs[nextInput].focus();
            }
            if (event.key === "ArrowLeft") {
                const prevInput = currentIndex - 1;
                if (prevInput >= 0) inputs[prevInput].focus();
            }
        });
    });
};


const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    let successGuess = true;
    for (let i = 1; i <= numbersOfLetters; i++) {
        const inputFiled = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputFiled.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
    
        //Game Logic
        if(letter === actualLetter) {
            inputFiled.classList.add("yes-in-place");
        }else if (wordToGuess.includes(letter) && letter !== "") {
            inputFiled.classList.add("not-in-place");
            successGuess = false; 
        }else {
            inputFiled.classList.add("no");
            successGuess = false;
        }
    }
    //check If user win or lose
    if(successGuess) {
        massageAera.innerHTML = `You Win After ${currentTry} Tries the word is <span>${wordToGuess}</span>`;
        pointer+=1;
        document.querySelector(".pointer span").innerHTML = pointer;
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
        guessButton.disabled = true;
        getHintButton.disabled = true;
        
    }else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
       const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
       currentTryInputs.forEach((input) => (input.disabled = true));
       currentTry++;
       const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${currentTry}`);
        if(el) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        }else {
            guessButton.disabled = true;
            getHintButton.disabled = true;
            massageAera.innerHTML = `You Lose the word is <span>${wordToGuess}</span>`;
        }
    }
}
function getHint() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;   
    }
    if(numberOfHints === 0) {
       getHintButton.disabled = true; 
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

    if (emptyEnabledInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if( indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0) {
            const currentinput = inputs[currentIndex];
            const prevsinput = inputs[currentIndex - 1];
            currentinput.value = "";
            prevsinput.value= "";
            prevsinput.focus();
        }
    }

}

document.addEventListener("keydown", handleBackspace)
window.onload = function() {
    generateInput();
};