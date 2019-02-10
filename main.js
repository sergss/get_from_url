function httpGet(theUrl) {
    // Install http-server by typing npm install -g http-server
    // Change into your working directory, where yoursome.html lives
    // Start your http server by issuing http-server -c-1
    // This spins up a Node.js httpd which serves the files in your directory as static files accessible from http://localhost:8080

    return new Promise(function (resolve, reject) {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                resolve(xmlhttp.responseText);
            }
        }
        xmlhttp.open("GET", theUrl, true);
        xmlhttp.send();
    });
}

function getLinksArray(str) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return str.match(urlRegex);
}

function getTargetDomain(inputUrl) {
    var targetDomain, slash;
    var startDomain = 0;
    var colonIndex = inputUrl.indexOf(":");
    if (colonIndex === -1) {
        slash = inputUrl.indexOf("/") === -1 ? undefined : inputUrl.indexOf("/");
        targetDomain = inputUrl.substr(startDomain, slash);
    } else {
        startDomain = colonIndex + 3;
        targetDomain = inputUrl.substr(startDomain);
        slash = targetDomain.indexOf("/") === -1 ? undefined : targetDomain.indexOf("/");
        targetDomain = targetDomain.substr(0, slash);
    }
    return targetDomain;
}

function getPageTitle(str) {
    var headingStart = str.indexOf("<h1>");
    if (headingStart !== -1) {
        var titleStart = str.substr(headingStart);
        return titleStart.substr(0, titleStart.indexOf("</h1>"));
    } else {
        return "no header found";
    }
}

function getUrlLink() {
    var btn = document.getElementsByTagName("button")[0];
    btn.setAttribute("disabled", "disabled");
    btn.innerHTML = "Loading...";
    var inputUrl = document.getElementById("inputUrl").value;
    var targetDomain = getTargetDomain(inputUrl);
    // fast fix of CORS problem is to add "https://cors.io/?" to url string
    httpGet("https://cors.io/?" + inputUrl).then(function (value) {
        var pageTitle = getPageTitle(value);
        var arrayOfLinks = getLinksArray(value).filter(function (item) {
            return item.indexOf(targetDomain) !== -1
        });
        var resultHtml = "";
        arrayOfLinks.forEach(function (elem) {
            resultHtml += '<a href="' + elem + '" target="_blank">' + elem + '</a><br>';
        });
        btn.removeAttribute("disabled");
        btn.innerHTML = "Grab more";
        document.getElementById("pageTitle").innerHTML = pageTitle;
        document.getElementById("result").innerHTML = resultHtml;
    });
}