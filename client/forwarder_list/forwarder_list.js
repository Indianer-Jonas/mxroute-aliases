import { listForwarders, deleteForwarder } from "../services/forwarders.js";

const listEl = document.getElementById("forwarderList");
const searchInput = document.getElementById("search");

let forwarders = [];


// load forwarders on page load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        listEl.innerHTML = "<li>Loading…</li>";
        forwarders = await listForwarders();
        renderList(forwarders);
    } catch (err) {
        console.error(err);
        listEl.innerHTML = "<li>" + err.message + "</li>";
    }
});


// search forwarders
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = forwarders.filter(fwd =>
        fwd.alias.toLowerCase().includes(query) ||
        fwd.email.toLowerCase().includes(query)
    );
    renderList(filtered);
});


// render forwarder list
function renderList(filteredForwarders) {
    listEl.innerHTML = "";

    if (filteredForwarders.length === 0) {
        listEl.innerHTML = "<li>No forwarders found.</li>";
        return;
    }

    filteredForwarders.forEach(fwd => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="forwarder-email">${fwd.email}</div>
            <div class="forwarder-destination">→ ${fwd.destinations.join(", ")}</div>
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
                forwarders = forwarders.filter(item => item.email !== fwd.email);
                renderList(forwarders);
            } catch (err) {
                console.error("Error deleting forwarder:", err);
            }
        });

        listEl.appendChild(li);
    });
}
