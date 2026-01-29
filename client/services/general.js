// returns current tab url
export async function getCurrentTabUrl() {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const url = new URL(tabs[0].url);
        return url.hostname;
    } catch (error) {
        console.error("Error getting current tab URL: ", error);
        return null;
    }
}



// render ForwarderOnlyList, ggf. filtered by pattern, with delete button
export async function renderForwarderOnlyList(forwarders, pattern) {
    const listEl = document.getElementById("forwarderList");
    listEl.innerHTML = "";

    if (!forwarders || forwarders.length === 0) {
        listEl.innerHTML = "<li class=\"no-forwarders\">No forwarders found.</li>";
        return;
    }

    if (pattern) forwarders = forwarders.filter(fwd => pattern && fwd.email.toLowerCase().includes(pattern));

    if (forwarders.length === 0) {
        listEl.innerHTML = "<li class=\"no-forwarders\">No forwarders for this URL.</li>";
        return;
    }

    forwarders.forEach(fwd => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="forwarder-email">${fwd.email}</div>
            <div class="forwarder-destination">→ ${fwd.destinations.join(", ")}</div>
            <button type="delete">Delete</button>
        `;
        // delete button
        const deleteBtn = li.querySelector("button[type='delete']");
        deleteBtn.addEventListener("click", async () => {
            try {
                await deleteForwarder(fwd.alias);
                li.remove();
            } catch (err) {
                console.error("Error deleting forwarder:", err);
            }
        });
        listEl.appendChild(li);
    });
}


// renders ForwarderDestList, ggf. filtered by pattern, with delete button
export async function renderForwarderDestList(forwarders, pattern) {
    const listEl = document.getElementById("forwarderList");
    listEl.innerHTML = "";
    if (!forwarders || forwarders.length === 0) {
        listEl.innerHTML = "<li class=\"no-forwarders\">No forwarders found.</li>";
        return;
    }
    if (pattern) forwarders = forwarders.filter(fwd => pattern && fwd.email.toLowerCase().includes(pattern));

    if (forwarders.length === 0) {
        listEl.innerHTML = "<li class=\"no-forwarders\">No forwarders for this URL.</li>";
        return;
    }
    forwarders.forEach(fwd => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="forwarder-email">${fwd.email}</div>
            <div class="forwarder-destination">→ ${fwd.destinations.join(", ")}</div>
            <button type="delete">Delete</button>
        `;
        // delete button
        const deleteBtn = li.querySelector("button[type='delete']");
        deleteBtn.addEventListener("click", async () => {
            try {
                await deleteForwarder(fwd.alias);
                li.remove();
            } catch (err) {
                console.error("Error deleting forwarder:", err);
            }
        });
        listEl.appendChild(li);
    });
}