var run = false;
var clicked = false;

var balls = 0;

var correct = document.getElementById("correct");
var triesSpan = document.getElementById("tries");
var winsSpan = document.getElementById("wins");
var chance = document.getElementById("chance");

document.getElementById("input").onclick = function() {
    if (clicked) {
        return;
    }
    clicked = true;
    balls = Number(document.getElementById("balls").value);
    var inner = "<br>";
    for (let i = 0; i < balls; i++) {
        inner += `Ball${i + 1} <input type="text" id="ball${i}"> `;
    }
    inner += '<br><button id="start">Start</button>';
    inner += '<br><input type="range" min="1" max="10000" value="1000" id="sleepTime">';

    var numbers = document.getElementById("numbers");
    numbers.innerHTML = inner;

    var start = document.getElementById("start");
    start.onclick = startClick;
}

function startClick() {
    run = !run;
    if (run) {
        generate();
        start.innerHTML = "Stop";
    } else {
        start.innerHTML = "Start";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate() {
    winsSpan.innerHTML = 0;
    var wins = 0;
    var tries = 0;

    var minNumber = Number(document.getElementById("minNumber").value);
    var maxNumber = Number(document.getElementById("maxNumber").value) + 1;
    var sleepTime = document.getElementById("sleepTime");

    balls = Number(document.getElementById("balls").value);
    var ballValues = [];
    for (let i = 0; i < balls; i++) {
        ballValues.push(Number(document.getElementById(`ball${i}`).value));
    }

    var diff = maxNumber - minNumber;
    if (diff + 1 <= balls) {
        return;
    }

    var possibilities = Math.pow(diff, balls);
    var failureChance = (possibilities - 1) / possibilities;
    var newfailureChance = failureChance;
    while (run) {
        var correctText = "";
        var failed = false;
        var pickedValues = [];
        for (let i = 0; i < ballValues.length; i++) {
            var ballValue = ballValues[i];
            var picked = 0;
            do {
                picked = Math.floor(Math.random() * diff) + minNumber;
            } while (pickedValues.includes(picked));
            pickedValues.push(picked);
            if (picked !== ballValue) {
                failed = true;
            }
            correctText += picked + " ";
        }
        
        if (!failed) {
            wins++;
            winsSpan.innerHTML = wins;
        }
        
        correct.innerHTML = correctText;
        tries++;
        triesSpan.innerHTML = tries;
        chance.innerHTML = 100 * (1 - newfailureChance);
        await sleep(sleepTime.value);
        newfailureChance *= failureChance;
    }
}