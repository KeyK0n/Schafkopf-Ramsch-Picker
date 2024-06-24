var settings;

var gamemodesInit;

var gamemodes;

var gamemode;
var gamemodeButton;

var shakeCounter = 0;

// Settings for countdown
var nameOfDayEvent = "Wednesday";
var hourOfEvent = 18;
var minuteOfEvent = 0;
var excludedDates = [
    new Date(2023, 11, 27, hourOfEvent, minuteOfEvent),
    new Date(2024, 0, 3, hourOfEvent, minuteOfEvent),
];
// Month: 0 = January, 1 = February, etc.

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

    // Init countdown
    setCountdown();

    requestAccelerometer();
}

function requestAccelerometer() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    handleOrientation();
                }
            })
            .catch(console.error);
    } else {
        handleOrientation();
    }
}

function handleOrientation() {
    if (gamemodeButton.disabled) {
        return;
    }

    if (typeof window.DeviceMotionEvent != 'undefined') {
        // Shake sensitivity (a lower number is more)
        var sensitivity = 20;
    
        // Position variables
        var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
    
        // Listen to motion events and update the position
        window.addEventListener('devicemotion', function (e) {
            x1 = e.accelerationIncludingGravity.x;
            y1 = e.accelerationIncludingGravity.y;
            z1 = e.accelerationIncludingGravity.z;
        }, false);
    
        // Periodically check the position and fire
        // if the change is greater than the sensitivity
        setInterval(function () {
            var change = Math.abs(x1-x2+y1-y2+z1-z2);
    
            if (change > sensitivity) {
                window.removeEventListener('devicemotion', null, false);
                // Prevent rerolling and spamming
                if (gamemodeButton.disabled) {
                    shakeCounter++;
                    if (shakeCounter > 3) {
                        alert('Schütteln kannst du was anderes! 🍆💦');
                        shakeCounter = 0;
                    }
                } else {
                    shakeCounter = 0;
                    rollClick();
                }
            }
    
            // Update new position
            x2 = x1;
            y2 = y1;
            z2 = z1;
        }, 500);
    }
        
}

// Countdown functions
function getNextDayOfTheWeek(dayName, hour = 0, minute = 0) {
    const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
                      .indexOf(dayName.slice(0,3).toLowerCase());
    var now = new Date()
    var result = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + (7 + dayOfWeek - now.getDay()) % 7,
                    hour,
                    minute)
    
    if (result < now)
        result.setDate(result.getDate() + 7)
    
    // Exclude dates
    for (let index = 0; index < excludedDates.length; index++) {
        const excludeDate = excludedDates[index];
        if (result.getTime() == excludeDate.getTime()) {
            result.setDate(result.getDate() + 7)
        }
    }

    return result
}
function getDateTimeSpan(date) {
    var now = new Date();
    var difference = date - now;
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}
function setCountdown() {
    var countDownDate = getNextDayOfTheWeek(nameOfDayEvent, hourOfEvent, minuteOfEvent);

    //Flipdown timer
    var flipdown = new FlipDown(countDownDate / 1000, "countdown", {
        headings: ["Tage", "Stunden", "Minuten", "Sekunden"],
        theme: "light"
    })
    .start()
    .ifEnded(() => {
        setCountdown();
    });
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
    standardSettingsActive = true;
    for (let index = 0; index < weights.length; index++) {
        var value = weights[index].innerHTML;
        for (let j = 0; j < value; j++) {
            gamemodes.push(gamemodesInit[index]);
        }

        if (value != 1) {
            standardSettingsActive = false;
        }
    }

    if (gamemodes.length == 0) {
        gamemodes.push("Du bist a Depp");
    }

    // Display standard settings active
    if (standardSettingsActive) {
        document.getElementById("standardSettingsActive").style.display = "flex";
    } else {
        document.getElementById("standardSettingsActive").style.display = "none";
    }
}

function rollClick() {
    if (gamemodeButton.disabled) {
        return;
    }

    // Set button disabled
    gamemodeButton.disabled = true;
    //stopAccelerometer();
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
        setDeceleratingTimeout(randomName, 10, timesOfChanging);

        // todo: timeout umbauen zu async
        setTimeout(() => {
            turnCard(false);
            //startAccelerometer();
            
            // Set button enabled after timeout
            gamemodeButton.disabled = false;
            
            // Animations after timeout
            var degreeMultiplier = 4;
            for (let index = 0; index < cards.length; index++) {
                cards[index].style.transform = "rotate(" + degreeMultiplier * 8 + "deg)";
                degreeMultiplier--;
            }

            // Change card images according to gamemode
            var card1 = document.getElementById("card1");
            var card2 = document.getElementById("card2");
            var card3 = document.getElementById("card3");
            var card4 = document.getElementById("card4");
            var card5 = document.getElementById("card5");
            var card6 = document.getElementById("card6");
            var card7 = document.getElementById("card7");
            var card8 = document.getElementById("card8");

            var base_path = "resources/karten/";

            switch (gamemode.innerText) {
                case "Normal":
                case "Der Alte muss":
                case "Geschoben":
                    card1.src = base_path + "schellen_unter.png";
                    card2.src = base_path + "herz_unter.png";
                    card3.src = base_path + "blatt_unter.png";
                    card4.src = base_path + "eichel_unter.png";
                    card5.src = base_path + "schellen_ober.png";
                    card6.src = base_path + "herz_ober.png";
                    card7.src = base_path + "blatt_ober.png";
                    card8.src = base_path + "eichel_ober.png";
                    break;
                case "Geschoben trumpffrei":
                case "Trumpffrei":
                    card1.src = base_path + "schellen_zehner.png";
                    card2.src = base_path + "herz_zehner.png";
                    card3.src = base_path + "blatt_zehner.png";
                    card4.src = base_path + "eichel_zehner.png";
                    card5.src = base_path + "schellen_ass.png";
                    card6.src = base_path + "herz_ass.png";
                    card7.src = base_path + "blatt_ass.png";
                    card8.src = base_path + "eichel_ass.png";
                    break;
                case "10er eingereiht":
                    card1.src = base_path + "herz_neuner.png";
                    card2.src = base_path + "herz_zehner.png";
                    card3.src = base_path + "herz_koenig.png";
                    card4.src = base_path + "herz_ass.png";
                    card5.src = base_path + "blatt_unter.png";
                    card6.src = base_path + "eichel_unter.png";
                    card7.src = base_path + "blatt_ober.png";
                    card8.src = base_path + "eichel_ober.png";
                    break;
                case "Trumpffrei 10er eingereiht":
                    card1.src = base_path + "schellen_koenig.png";
                    card2.src = base_path + "herz_koenig.png";
                    card3.src = base_path + "blatt_koenig.png";
                    card4.src = base_path + "eichel_koenig.png";
                    card5.src = base_path + "schellen_ass.png";
                    card6.src = base_path + "herz_ass.png";
                    card7.src = base_path + "blatt_ass.png";
                    card8.src = base_path + "eichel_ass.png";
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
    var card8_container = document.getElementById('card8_container');
    var card = card8_container.getElementsByClassName('card')[0];
    if (state) {
        card.classList.add('is-flipped');
    } else {
        card.classList.remove('is-flipped');
    }
}