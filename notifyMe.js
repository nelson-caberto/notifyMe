
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

var timeout = 10000;

function questionCheck() {
    var spanTags = document.getElementsByTagName("span");
    var refreshElement;
    
    for (var i = 0; i < spanTags.length; i++) {
      if (spanTags[i].textContent == " Refresh") {
        refreshElement = spanTags[i];
        break;
      }
    }
    
    refreshElement.click();
    
    if (window.find('View Question')) {
        notifyMe("New AskBCS Question!");
        console.log('notifying');
    }

    console.log('refreshing');
    setTimeout(questionCheck, timeout);
}

setTimeout(questionCheck, timeout);