const proxyserver = "https://mxroute-proxy.indianerjonas.de/api/";

function getCurrentTabUrl(callback) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        var tab = tabs[0];
        var url = new URL(tab.url);
        callback(url.hostname);
    }).catch((error) => {
        console.error("Error getting current tab URL: ", error);
    });
}

document.getElementById("createMail").addEventListener("click", function () {
    const config = JSON.parse(localStorage.getItem('config'));
    if (!config) {
        console.error("Configuration not found");
        return;
    }

    const { subdomain, user, key, user_domain, receiver, domainInfo } = config;


    getCurrentTabUrl(function (currentDomain) {
        if (!currentDomain || !domainInfo) {
            currentDomain = "";
        }else currentDomain += "_";
        var emailPrefix = "alias_" + currentDomain + Math.random().toString(36).substring(2, 15);
        var email = emailPrefix + "@" + user_domain;
        navigator.clipboard.writeText(email).then(function () {
            // console.log("Email copied to clipboard");
            // console.log(emailPrefix);
            document.getElementById("createMail").style.backgroundColor = "#4cacaf";
        }, function (err) {
            console.error("Could not copy email: ", err);
        });

        fetch(proxyserver + subdomain + "/CMD_EMAIL_FORWARDER", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(user + ":" + key),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                domain: user_domain,
                action: "create",
                user: emailPrefix,
                email: receiver,
                create: "Create"
            })
        });
    });
});

document.getElementById("submitCustomMail").addEventListener("click", function () {
    const config = JSON.parse(localStorage.getItem('config'));
    if (!config) {
        console.error("Configuration not found");
        return;
    }
    const { subdomain, user, key, user_domain, receiver, domainInfo } = config;

    const emailPrefix = document.getElementById("emailPrefix").value;
    if (emailPrefix && emailPrefix.length > 0 && emailPrefix.length <= 32) {
        const mailAdress = emailPrefix + "@" + user_domain;
        navigator.clipboard.writeText(mailAdress).then(function () {
            // console.log("Email copied to clipboard");
            // console.log(mailAdress);
            document.getElementById("submitCustomMail").style.backgroundColor = "#4cacaf";
        }, function (err) {
            console.error("Could not copy custom email: ", err);
        });
        fetch(proxyserver + subdomain + "/CMD_EMAIL_FORWARDER", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(user + ":" + key),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                domain: user_domain,
                action: "create",
                user: emailPrefix,
                email: receiver,
                create: "Create"
            })
        });
    } else {
        console.error("No custom email entered");
    }
});