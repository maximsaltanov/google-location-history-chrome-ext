function isGoogleAuthorised(sendResponse) {

    if (!sendResponse) return;

    console.log('check google auth started');

    chrome.cookies.getAll({ domain: ".google.com" }, function (cookie) {        
        for(i=0;i<cookie.length;i++){
          var coo = JSON.parse(JSON.stringify(cookie[i]));
            if (coo.name.toLowerCase().indexOf('__secure-3psid') != -1) {
                sendResponse(true);

                console.log('already authorised');
                return;
          }
        }

        console.log('authorisation required');
        sendResponse(false);
    });        
}
