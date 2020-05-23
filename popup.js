var bg = chrome.extension.getBackgroundPage();

function getDayHistory(date) {

    var month = date.getUTCMonth(); // months from 0-11
    var day = date.getUTCDate();
    var year = date.getUTCFullYear();

    var dateF = day + '/' + (month + 1) + '/' + year;

    var nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    var nextDayMonth = nextDay.getUTCMonth(); 
    var nextDayDay = nextDay.getUTCDate();
    var nextDayYear = nextDay.getUTCFullYear();

    var url = 'https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i' + year + '!2i' + month + '!3i' + day + '!2m3!1i'
        + nextDayYear + '!2i' + nextDayMonth + '!3i' + nextDayDay;
    
    fetch(url).then(r => r.text()).then(result => {
        console.log('received location history on ' + dateF, result);
    });
}

function delay() {

    var min = 100, max = 300;
    var rand = Math.floor(Math.random() * (max - min + 1) + min);
    ////alert('Wait for ' + rand + ' milliseconds');    

    return new Promise(function (r) {
        setTimeout(r, rand);
    });
}

function getLocationHistory(totalDays) {        
    
    var endDay = new Date();
    var startDay = new Date();    
    startDay.setDate(startDay.getDate() - totalDays + 1);

    var funcArray = [];

    for (var dt = new Date(startDay); dt <= endDay; dt.setDate(dt.getDate() + 1)) {             
        funcArray.push(getDayHistory.bind(null, new Date(dt)));
    }        

    console.log('started');

    funcArray.reduce(function (promise, func) {
        return promise.then(func).then(delay);
    }, delay()).then(function () {
        console.log('all finished')
    });    
}

window.onload = function () {    

    var cntLogin = document.getElementById("login-container");
    var cntSend = document.getElementById("send-container");            

    cntLogin.style.display = 'none';
    cntSend.style.display = 'none';

    cntSend.addEventListener("click", function () {
        getLocationHistory(21); //// get location history for the latest n-days
    });

    cntLogin.addEventListener("click", function () {
        chrome.tabs.create({ url: "https://myaccount.google.com" });
    });            

    bg.isGoogleAuthorised(function (result) {
        if (result) {            
            cntSend.style.display = 'inline';
        }
        else {
            cntLogin.style.display = 'inline';
        }
    });       
}

chrome.tabs.onUpdated.addListener(function (tabId, info) {
    if (info.status === 'complete') {
        chrome.tabs.get(tabId, function (tab) {

            console.log('tab loaded ' + tab.url);

            if (tab.url == "https://myaccount.google.com/") {           
                document.getElementById("send-container").style.display = 'inline';
            }
        });
    }
});