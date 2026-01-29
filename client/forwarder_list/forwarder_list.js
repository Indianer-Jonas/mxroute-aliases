import { listForwarders, deleteForwarder } from "../services/forwarders.js";

const listEl = document.getElementById("forwarderList");
const searchInput = document.getElementById("search");

let forwarders = [];

document.addEventListener("DOMContentLoaded", async () => {
    const config = JSON.parse(localStorage.getItem("config"));

    if (!config) {
        listEl.innerHTML = "<li>No configuration found.</li>";
        return;
    }

    try {
        const forwarders = await listForwarders();
        renderList(forwarders);
    } catch (err) {
        console.error(err);
        listEl.innerHTML = "<li>Error loading< forwarders.</li>";
    }
});

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = forwarders.filter(f =>
        f.alias.toLowerCase().includes(query) ||
        f.email.toLowerCase().includes(query)
    );
    renderList(filtered);
});

function renderList(forwarders) {
    listEl.innerHTML = "";

    if (forwarders.length === 0) {
        listEl.innerHTML = "<li>No forwarders found.</li>";
        return;
    }

    forwarders.forEach(fwd => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="forwarder-email">${fwd.email}</div>
            <div class="forwarder-destination">→ ${fwd.destinations.join(", ")}</div>
            <button type="delete">Delete</button>
        `;


        // click to copy email to clipboard
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
            const config = JSON.parse(localStorage.getItem("config"));
            try {
                await deleteForwarder(fwd.email);
                li.remove();
            } catch (err) {
                console.error("Error deleting forwarder:", err);
            }
        });

        listEl.appendChild(li);
    });
}
