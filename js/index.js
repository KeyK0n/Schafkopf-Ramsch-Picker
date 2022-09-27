var settings;

var gamemodesInit;

var gamemodes;

var gamemode;
var gamemodeButton;

function updateSlidersAndGamesModesOnLoad() {
    // Init
    settings = document.getElementById("settings");

    gamemodesInit = [
        "Normal",
        "10er eingereiht",
        "Trumpffrei",
        "Trumpffrei 10er eingereiht",
        "Geschoben",
        "Geschoben trumpffrei",
        "Der Alte muss"
    ];
    
    gamemodes = [];
    
    gamemode = document.querySelector("#gamemode");
    gamemodeButton = document.getElementById("gamemodeButton");

    // Update sliders
    // And build gamemodes array on last slider update
    var updateWeights = false;
    var sliders = document.getElementsByClassName("slider");
    for (let index = 0; index < sliders.length; index++) {
        const slider = sliders[index];

        if (index == sliders.length - 1) {
            updateWeights = true;
        }

        updateSlider(slider.value, slider.nextElementSibling.id, updateWeights);
    }
}

function showSettings() {
    if (settings.style.display == "flex") {
        settings.style.display = "none";
    }
    else {
        settings.style.display = "flex";
    }
}

function resetSettings() {
    // Reset sliders
    // And build gamemodes array on last slider update
    var updateWeights = false;
    var sliders = document.getElementsByClassName("slider");
    for (let index = 0; index < sliders.length; index++) {
        const slider = sliders[index];

        if (index == sliders.length - 1) {
            updateWeights = true;
        }

        slider.value = 1;

        updateSlider(slider.value, slider.nextElementSibling.id, updateWeights);
    }
}

function updateSlider(value, id, updateSlider) {
    document.getElementById(id).innerHTML = value;

    // Update array
    if (updateSlider) {
        BuildGamemodeSelectionAndWeight();
    }
}

function BuildGamemodeSelectionAndWeight() {
    // Reset array
    gamemodes.length = 0;

    var weights = document.getElementsByClassName("weight");

    for (let index = 0; index < weights.length; index++) {
        var value = weights[index].innerHTML;
        for (let j = 0; j < value; j++) {
            gamemodes.push(gamemodesInit[index]);
        }
    }

    if (gamemodes.length == 0) {
        gamemodes.push("Du bist a Depp");
    }
}

function rollClick() {
    // Set button disabled
    gamemodeButton.disabled = true;

    turnCard(true);
    
    // Timeout before choosing gamemode
    setTimeout(() => {
        BuildGamemodeSelectionAndWeight();

        // Reset animations of cards
        var cards = document.getElementsByClassName("card-fan");

        for (let index = 0; index < cards.length; index++) {
            cards[index].style.transform = "none";
        }
        
        // Raffling animation
        // todo: min und max in einstellungen festlegen?
        var timesOfChanging = randomIntFromInterval(20, 25);
        timesOfChanging = 25;
        setDeceleratingTimeout(randomName, 10, timesOfChanging);

        // todo: timeout umbauen zu async
        setTimeout(() => {
            turnCard(false);
            
            // Set button enabled after timeout
            gamemodeButton.disabled = false;
            
            // Animations after timeout
            var degreeMultiplier = 4;
            for (let index = 0; index < cards.length; index++) {
                cards[index].style.transform = "rotate(" + degreeMultiplier * 8 + "deg)";
                degreeMultiplier--;
            }

            // Change cards according to gamemode
            console.log(gamemode.innerText);

            switch (gamemode.innerText) {
                case "Normal":
                case "Der Alte muss":
                case "Geschoben":
                    document.getElementById("card1").src = "resources/karten/schellen_unter.png";
                    document.getElementById("card2").src = "resources/karten/herz_unter.png";
                    document.getElementById("card3").src = "resources/karten/blatt_unter.png";
                    document.getElementById("card4").src = "resources/karten/eichel_unter.png";
                    document.getElementById("card5").src = "resources/karten/schellen_ober.png";
                    document.getElementById("card6").src = "resources/karten/herz_ober.png";
                    document.getElementById("card7").src = "resources/karten/blatt_ober.png";
                    document.getElementById("card8_picture").src = "resources/karten/eichel_ober.png";
                    break;
                case "Geschoben trumpffrei":
                case "Trumpffrei":
                    document.getElementById("card1").src = "resources/karten/schellen_zehner.png";
                    document.getElementById("card2").src = "resources/karten/herz_zehner.png";
                    document.getElementById("card3").src = "resources/karten/blatt_zehner.png";
                    document.getElementById("card4").src = "resources/karten/eichel_zehner.png";
                    document.getElementById("card5").src = "resources/karten/schellen_ass.png";
                    document.getElementById("card6").src = "resources/karten/herz_ass.png";
                    document.getElementById("card7").src = "resources/karten/blatt_ass.png";
                    document.getElementById("card8_picture").src = "resources/karten/eichel_ass.png";
                    break;
                case "10er eingereiht":
                    document.getElementById("card1").src = "resources/karten/herz_neuner.png";
                    document.getElementById("card2").src = "resources/karten/herz_zehner.png";
                    document.getElementById("card3").src = "resources/karten/herz_koenig.png";
                    document.getElementById("card4").src = "resources/karten/herz_ass.png";
                    document.getElementById("card5").src = "resources/karten/blatt_unter.png";
                    document.getElementById("card6").src = "resources/karten/eichel_unter.png";
                    document.getElementById("card7").src = "resources/karten/blatt_ober.png";
                    document.getElementById("card8_picture").src = "resources/karten/eichel_ober.png";
                    break;
                case "Trumpffrei 10er eingereiht":
                    document.getElementById("card1").src = "resources/karten/schellen_koenig.png";
                    document.getElementById("card2").src = "resources/karten/herz_koenig.png";
                    document.getElementById("card3").src = "resources/karten/blatt_koenig.png";
                    document.getElementById("card4").src = "resources/karten/eichel_koenig.png";
                    document.getElementById("card5").src = "resources/karten/schellen_ass.png";
                    document.getElementById("card6").src = "resources/karten/herz_ass.png";
                    document.getElementById("card7").src = "resources/karten/blatt_ass.png";
                    document.getElementById("card8_picture").src = "resources/karten/eichel_ass.png";
                    break;
                default:
                    // does not occur
                    break;
            }

        }, timesOfChanging * 120);
    }, 200);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomName() {
    const rand = Math.floor(Math.random() * gamemodes.length);
    
    const name = gamemodes[rand];
    gamemode.innerText = name;

    gamemode.animate([
        { transform: 'translateY(-100%)', opacity: '0' },
        { transform: 'translateY(-90%)',  opacity: '0.1' },
        { transform: 'translateY(-80%)',  opacity: '0.2' },
        { transform: 'translateY(-70%)',  opacity: '0.3' },
        { transform: 'translateY(-60%)',  opacity: '0.4' },
        { transform: 'translateY(-50%)',  opacity: '0.5' },
        { transform: 'translateY(-40%)',  opacity: '0.6' },
        { transform: 'translateY(-30%)',  opacity: '0.7' },
        { transform: 'translateY(-20%)',  opacity: '0.8' },
        { transform: 'translateY(-10%)',  opacity: '0.9' },
        { transform: 'translateY(0)', opacity: '1' }           
        ], { 
                duration: 25,            
            }
    );
}

function setDeceleratingTimeout(callback, factor, times) {
    const internalCallback = ((t, counter) => {
        return () => {
            if (--t > 0) {
                setTimeout(internalCallback, ++counter * factor);
                callback();
            }
        };
    })(times, 0);

    setTimeout(internalCallback, factor);
}

function turnCard(state) {
    var card8 = document.getElementById('card8');
    var card = card8.getElementsByClassName('card')[0];
    if (state) {
        card.classList.add('is-flipped');
    } else {
        card.classList.remove('is-flipped');
    }
}