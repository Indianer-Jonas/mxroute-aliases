// creates a fowarder and returns the email address
// const { user_domain, subdomain, key,user, emailPrefix, receiver }
const DEFAULT_PROXY = JSON.parse(localStorage.getItem("config"))?.proxyDomain || "https://mxroute-proxy.indianerjonas.de";


// function fetching and returning config
async function loadConfig() {
    let config;
    try {
        config = JSON.parse(localStorage.getItem("config"));
    } catch {
        throw new Error("Configuration is corrupted");
    }

    if (!config) {
        throw new Error("Configuration not found");
    }
    const { subdomain, user, key, user_domain, receiver, domainInfo, proxyDomain } = config;
    if (!subdomain || !user || !key || !user_domain || !receiver) throw new Error("Incomplete configuration");
    return { subdomain, user, key, user_domain, receiver, domainInfo, proxyDomain: proxyDomain || DEFAULT_PROXY };
}


// function checking if domainInfo is enabled
export async function isDomainInfoEnabled() {
    const { domainInfo } = await loadConfig();
    return Boolean(domainInfo);
}

// function creating forwarder
export async function createForwarder(emailPrefix) {
    if(!emailPrefix || emailPrefix.length > 32) {
        throw new Error("Invalid email prefix");
    }
    const { user_domain, subdomain, user, key, receiver, proxyDomain } = await loadConfig();
    // checks if forwarder exists
    const existingForwarders = await listForwarders();
    if (existingForwarders.some(fwd => fwd.alias === emailPrefix)) {
        throw new Error("Forwarder already exists");
    }
    const res = await fetch(proxyDomain + "/createForwarder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_domain,
            subdomain,
            user,
            key,
            emailPrefix,
            receiver
        })
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("MXroute API error:", data);
        throw new Error("MXroute API error");
    }

    return emailPrefix + "@" + user_domain;
}


// function returning forwarders
// const { user_domain, subdomain, key,user }
export async function listForwarders() {
    const { user_domain, subdomain, user, key, proxyDomain } = await loadConfig();
    const params = new URLSearchParams({ user_domain, subdomain, user, key });
    const res = await fetch(proxyDomain + "/listForwarders?" + params.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    if (!res.ok) {
        console.error("MXroute API error:", data);
        throw new Error("MXroute API error");
    }

    return data.data;
}


// function to delete forwarder
// const { user_domain, subdomain, user, key, alias }
export async function deleteForwarder(alias) {
    if(!alias || alias.length > 32) {
        throw new Error("Invalid alias");
    }
    const { user_domain, subdomain, user, key, proxyDomain } = await loadConfig();
    const params = new URLSearchParams({ user_domain, subdomain, user, key, alias });
    const res = await fetch(proxyDomain + "/deleteForwarder?" + params.toString(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (!res.ok) {
        console.error("MXroute API error:", data);
        throw new Error("MXroute API error");
    }
    return true;
}
