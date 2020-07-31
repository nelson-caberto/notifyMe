// ==UserScript==
// @name        notifyMe AskBCS
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/*
// @grant       none
// @version     0.2
// @author      Nelson Caberto
// @description Adds Browser to OS notification when AskBCS receives a new question. 6/19/2020, 12:52:37 PM
// ==/UserScript==
const isMac = window.navigator.platform !== "Win32";

function playAudio() {
    var audioNode = document.createElement("audio");
    audioNode.setAttribute("id","macOSnotification");
    var sourceNode = document.createElement("source");
    sourceNode.setAttribute("src","https://github.com/nelson-caberto/notifyMe/blob/master/anxious.ogg?raw=true");
    sourceNode.setAttribute("type","audio/ogg");

    audioNode.appendChild(sourceNode);

    var refreshElement = getElementByInnerText("span", " Refresh");
    refreshElement.parentElement.appendChild(audioNode)
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
        isMac && playAudio();
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(msg);
                isMac && playAudio();
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
    if (refreshElement === -1) {
        console.log('refresh button not found');
        setTimeout(clickRefresh, 10000);
        return;
    }
    refreshElement.click();
    setTimeout(checkQuestion, 2000);
}

function checkQuestion() {
    removeAvailableQuestion();
    console.log('checking');
    if (!is(active) && (is(inclass) || is(available))) {
        console.log('notifying');
        notifyMe("New AskBCS Question!");
    }
    console.log('waiting')
    setTimeout(clickRefresh, 10000);
}

//window.addEventListener stopped working on latest chrome
function start() {
    !(getElementByInnerText("span", " Refresh") === -1) && checkQuestion();
}

setTimeout(start, 5000);

function removeAvailableQuestion() {
    const ask = [
        "ASK-6887 | Previous assignment",
        "ASK-6891 | Previous assignment"
    ];

    ask.forEach(ask=>{
        tag = getElementByInnerText('span', ask);
        if (tag !== -1) {
            tagParent4 = tag.parentElement.parentElement.parentElement.parentElement;
            tagParent4.nextElementSibling.remove();
            tagParent4.nextElementSibling.remove();
            tagParent4.previousElementSibling.remove();
            tagParent4.remove();
            console.log("removed " + ask);
        }
        aq = getElementByInnerText('span', "AVAILABLE QUESTIONS").parentElement.parentElement.parentElement.parentElement.parentElement;
        rq = getElementByInnerText('span', "RESOLVED QUESTIONS").parentElement.parentElement.parentElement.parentElement.parentElement;
        if (aq.nextElementSibling.nextElementSibling === rq) {
            aq.nextElementSibling.remove();
            aq.remove();
        }
    });
}
