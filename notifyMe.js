// ==UserScript==
// @name        notifyMe AskBCS
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/*
// @grant       none
// @version     0.1
// @author      Nelson Caberto
// @description Adds Browser to OS notification when AskBCS receives a new question. 6/19/2020, 12:52:37 PM
// ==/UserScript==
var isMac = window.navigator.platform !== "Win32";

if (isMac) {
    var audioNode = document.createElement("audio");
    audioNode.setAttribute("id","macOSnotification");
    var sourceNode = document.createElement("source");
    sourceNode.setAttribute("src","https://github.com/nelson-caberto/notifyMe/blob/master/anxious.ogg?raw=true")
    sourceNode.setAttribute("type","audio/ogg");

    audioNode.appendChild(sourceNode);

    var refreshElement = getElementByInnerText("span", " Refresh");
    refreshElement.parentElement.appendChild(audioNode)
}

function playMacAudio() {
    audioElement = document.getElementById("macOSnotification");
    audioElement.play();
}

// https://developer.mozilla.org/en-US/docs/Web/API/notification
function notifyMe(msg) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(msg);
        isMac && playMacAudio();
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(msg);
                isMac && playMacAudio();
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

// https://stackoverflow.com/questions/3813294/how-to-get-element-by-innertext
function getElementByInnerText(tag, text) {
    const tags = document.getElementsByTagName(tag);

    for (var i = 0; i < tags.length; i++)
        if (tags[i].textContent == text) return tags[i];
    return -1;
}

function is(question) { return window.find(question); }
const active = "ACTIVE QUESTIONS";
const inclass = "IN CLASS ACTIVITY QUESTIONS";
const available = "AVAILABLE QUESTIONS";

function clickRefresh() {
    console.log('refreshing');
    const refreshElement = getElementByInnerText("span", " Refresh");
    refreshElement.click();
    setTimeout(checkQuestion, 2000);
}

function checkQuestion() {
    console.log('checking');
    if (!is(active) && (is(inclass) || is(available))) {
        console.log('notifying');
        notifyMe("New AskBCS Question!");
    }
    console.log('waiting')
    setTimeout(clickRefresh, 10000);
}

window.addEventListener('load', function () {
    !(getElementByInnerText("span", " Refresh") === -1) && checkQuestion();
});
