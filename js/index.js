var settings;

var gamemodesInit;

var gamemodes;

var gamemode;
var gamemodeButton;

function updateSlidersAndGamesModesOnLoad()
{
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

function resetSettings()
{
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
    // console.log(value);
    // console.log(id);

    document.getElementById(id).innerHTML = value;

    // update array
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
    // console.info(gamemodes);
}

function rollClick() {
    // Set button disabled
    gamemodeButton.disabled = true;

    BuildGamemodeSelectionAndWeight();

    // Reset animations of cards
    var cards = document.getElementsByClassName("card-fan");

    for (let index = 0; index < cards.length; index++) {
        cards[index].style.transform = "none";
    }
    
    // Raffling animation
    // todo: min und max in einstellungen festlegen?
    var timesOfChanging = randomIntFromInterval(15,20);
    setDeceleratingTimeout(randomName, 10, timesOfChanging);

    // todo: timeout umbauen zu 
    setTimeout(() => {
        // Set button enabled after timeout
        gamemodeButton.disabled = false;
        
        // Animations after timeout
        var degreeMultiplier = 4;
        for (let index = 0; index < cards.length; index++) {
            cards[index].style.transform = "rotate(" + degreeMultiplier * 8 + "deg)";
            degreeMultiplier--;
        }

    }, timesOfChanging*85);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomName() {
    const rand = Math.floor(Math.random() * gamemodes.length);
    // console.log(rand);
    
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