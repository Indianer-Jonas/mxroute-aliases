import { createForwarder, listForwarders, isDomainInfoEnabled } from "../services/forwarders.js";
import { getCurrentTabUrl, renderForwarderOnlyList } from "../services/general.js";

// function to display popup info messages
async function popUpInfo(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// list of all forwarders of the current url
document.addEventListener("DOMContentLoaded", async () => {
    const listEl = document.getElementById("forwarderList");

    try {
        const url = (await getCurrentTabUrl()).replace(/[^a-zA-Z0-9]/g, "_");
        const forwarders = await listForwarders();
        renderForwarderOnlyList(forwarders, url);
    } catch (err) {
        console.error(err);
        listEl.innerHTML = "<li>Error loading forwarders.</li>";
    }
});



// create forwarder 
document.getElementById("createMail").addEventListener("click", async function () {
    let emailPrefix = document.getElementById("emailPrefix").value;
    if (!emailPrefix || emailPrefix.length > 32) {
        try {
            let suffix = "";
            if (await isDomainInfoEnabled()) {
                const url = await getCurrentTabUrl();
                if (!url) {
                    popUpInfo("Could not get current tab URL");
                    return;
                }
                suffix = "_" + url.replace(/[^a-zA-Z0-9]/g, "_");
            }
            emailPrefix ="alias" + suffix +"_" + Math.random().toString(36).substring(2, 10);
        } catch (err) {
            console.error(err);
            popUpInfo(err.message || "Could not generate alias");
            return;
        }
    }


    try {
        const forwarderEmail = await createForwarder(emailPrefix);
        await navigator.clipboard.writeText(forwarderEmail);
        popUpInfo("Forward created and copied");
        document.getElementById("createMail").style.backgroundColor = "#4cacaf";
    } catch (error) {
        popUpInfo("Error creating forwarder.");
        console.error("Error creating forwarder:", error);
        document.getElementById("createMail").style.backgroundColor = "#f28b82";
    }


});


// opens options page
document.getElementById("openOptions").addEventListener("click", function () {
    if (browser.runtime.openOptionsPage) {
        browser.runtime.openOptionsPage();
    } else {
        window.open(browser.runtime.getURL("option/options.html"));
    }
});

// opens forwarders list page
document.getElementById("openForwarders").addEventListener("click", function () {
    window.open(browser.runtime.getURL("forwarder_list/forwarder_list.html"));
});