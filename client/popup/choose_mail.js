import { createForwarder, listForwarders, isDomainInfoEnabled, deleteForwarder } from "../services/forwarders.js";
import { getCurrentTabUrl } from "../services/general.js";

let forwarders = [];

// function to display popup info messages
async function popUpInfo(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}



// renders forwarders
async function renderForwarders() {
    const listEl = document.getElementById("forwarderList");
    listEl.innerHTML = "<li>Loading…</li>";
    try {
        // when in settigns etc. there is no url
        const url = (await getCurrentTabUrl()).replace(/[^a-zA-Z0-9]/g, "_");
        forwarders = await listForwarders();
        listEl.innerHTML = "";
        if (forwarders.length === 0 || !url) {
            listEl.innerHTML = "<li>No forwarders found.</li>";
            return;
        }
        forwarders.forEach(fwd => {
            const li = document.createElement("li");

            li.innerHTML = `
                    <div class="forwarder-email">${fwd.email}</div>
                    <button type="delete">Delete</button>
                `;


            // click to copy to clipboard
            const emailDiv = li.querySelector(".forwarder-email");
            emailDiv.style.cursor = "pointer";
            emailDiv.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(fwd.email);
                    emailDiv.style.backgroundColor = "#d4edda";
                    setTimeout(() => {
                        emailDiv.style.backgroundColor = "";
                    }, 500);
                } catch (err) {
                    console.error("Failed to copy:", err);
                }
            });

            // delete forwarder
            const deleteBtn = li.querySelector("button[type='delete']");
            deleteBtn.addEventListener("click", async () => {
                // await confirmation
                if (!window.confirm("Delete forwarder " + fwd.email + "?")) return;
                try {
                    await deleteForwarder(fwd.alias);
                    forwarders = forwarders.filter(item => item.alias !== fwd.alias);
                    renderForwarders();
                } catch (err) {
                    console.error("Error deleting forwarder:", err);
                }
            });

            listEl.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        listEl.innerHTML = "<li>Error loading forwarders.</li>";
    }
}


//runs on window load
document.addEventListener("DOMContentLoaded", renderForwarders);


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
            emailPrefix = "alias" + suffix + "_" + Math.random().toString(36).substring(2, 10);
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
        await renderForwarders();
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