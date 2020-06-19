
function notifyMe(msg) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(msg);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(msg);
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

function getElementByInnerText(tag, text) {
    var spanTags = document.getElementsByTagName(tag);
    var result;
    
    for (var i = 0; i < spanTags.length; i++) {
      if (spanTags[i].textContent == text) {
        result = spanTags[i];
        break;
      }
    }
    return result;
}

var timeout = 10000;

function questionCheck() {
    var refreshElement = getElementByInnerText("span", " Refresh");
    console.log('refreshing');
    refreshElement.click();
    
    if (window.find("AVAILABLE QUESTIONS") && !window.find("ACTIVE QUESTIONS")) {
        notifyMe("New AskBCS Question!");
        console.log('notifying');
    }

    setTimeout(questionCheck, timeout);
}

setTimeout(questionCheck, timeout);