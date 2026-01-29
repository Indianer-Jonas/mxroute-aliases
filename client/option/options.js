import { listForwarders } from "../services/forwarders.js";

document.addEventListener("DOMContentLoaded", () => {

    // Load saved settings
    loadSettings();

    // Attach submit listener
    const form = document.getElementById("configForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();  // prevent page reload
        saveSettings();          // save settings to localStorage
    });
});



function saveSettings() {
    const requiredInputs = document.querySelectorAll("[required]");
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add("invalid");
            isValid = false;
        }
    });

    if (!isValid) {
        alert("Please fill in all required fields.");
        return;
    }


    const subdomain = document.getElementById("subdomain").value.trim();
    const user = document.getElementById("user").value.trim();
    const key = document.getElementById("key").value.trim();
    const user_domain = document.getElementById("user_domain").value.trim();
    const receiver = document.getElementById("receiver").value.trim();
    const domainInfo = document.getElementById("domainInfo").checked ? 1 : 0;
    const proxyDomain = document.getElementById("proxyDomain").value.trim();

    const config = { subdomain, user, key, user_domain, receiver, domainInfo, proxyDomain };
    localStorage.setItem("config", JSON.stringify(config));

    // check validity by trying to list forwarders
    listForwarders()
        .then(() => {
            // If successful, save settings
            alert("Settings validated and saved!");
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to validate settings. Please check your inputs.");
        });

}



function loadSettings() {
    const config = JSON.parse(localStorage.getItem("config"));
    if (config) {
        document.getElementById("subdomain").value = config.subdomain;
        document.getElementById("user").value = config.user;
        document.getElementById("key").value = config.key;
        document.getElementById("user_domain").value = config.user_domain;
        document.getElementById("receiver").value = config.receiver;
        document.getElementById("domainInfo").checked = config.domainInfo;
        document.getElementById("proxyDomain").value = config.proxyDomain;
    }
}