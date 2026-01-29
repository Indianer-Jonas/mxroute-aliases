const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());


app.use('/api/:subdomain/', (req, res, next) => {
    const subdomain = req.params.subdomain;
    // console.log(`Subdomain: ${subdomain}`);
    const target = `https://${subdomain}.mxrouting.net:2222`;
    // console.log(`Target URL: ${target}`);
    createProxyMiddleware({
        target: target,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('Authorization', req.headers['authorization'] || '');
        }
    })(req, res, next);

});


// new mxroute api example

// create forwarder
// fetch('https://api.mxroute.com/domains/{domain}/forwarders', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'X-Server': 'YOUR_SECRET_TOKEN',
//     'X-Username': 'YOUR_SECRET_TOKEN',
//     'X-API-Key': 'YOUR_SECRET_TOKEN'
//   },
//   body: JSON.stringify({
//     alias: 'your_alias',
//     destinations: ['recipient@otherdomain.com']
//   })
// })


// new forrward for new mxroute api now using the clients body to get subdoamin etc.
app.post("/createForwarder", express.json(), async (req, res) => {
    try {
        const { user_domain, subdomain, user, key, emailPrefix, receiver } = req.body;
        if (!user_domain || !subdomain || !key || !user || !emailPrefix || !receiver || !receiver.length) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const mxrouteRes = await fetch("https://api.mxroute.com/domains/" + user_domain + "/forwarders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Server": subdomain + ".mxrouting.net",
                "X-Username": user,
                "X-API-Key": key
            },
            body: JSON.stringify({ alias: emailPrefix, destinations: receiver })
        });

        const data = await mxrouteRes.json();
        res.status(mxrouteRes.status).json(data);
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Internal proxy error" });
    }
});


// list forwarders
// fetch('https://api.mxroute.com/domains/{domain}/forwarders', {
//   headers: {
//     'X-Server': 'YOUR_SECRET_TOKEN',
//     'X-Username': 'YOUR_SECRET_TOKEN',
//     'X-API-Key': 'YOUR_SECRET_TOKEN'
//   }
// })


// list forwarders
app.get("/listForwarders", async (req, res) => {
    try {
        const { user_domain, subdomain, user, key } = req.query;
        if (!user_domain || !subdomain || !key || !user) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const mxrouteRes = await fetch("https://api.mxroute.com/domains/" + user_domain + "/forwarders", {
            method: "GET",
            headers: {
                "X-Server": subdomain + ".mxrouting.net",
                "X-Username": user,
                "X-API-Key": key
            }
        });
        const data = await mxrouteRes.json();
        res.status(mxrouteRes.status).json(data);
    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Internal proxy error" });
    }
});



// delete forwarder
// fetch('https://api.mxroute.com/domains/{domain}/forwarders/{alias}', {
//   method: 'DELETE',
//   headers: {
//     'X-Server': 'YOUR_SECRET_TOKEN',
//     'X-Username': 'YOUR_SECRET_TOKEN',
//     'X-API-Key': 'YOUR_SECRET_TOKEN'
//   }
// })

// delete forwarder
app.delete("/deleteForwarder", async (req, res) => {
    try {
        const { user_domain, subdomain, user, key, alias } = req.query;
        if (!user_domain || !subdomain || !key || !user || !alias) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const mxrouteRes = await fetch("https://api.mxroute.com/domains/" + user_domain + "/forwarders/" + alias, {
            method: "DELETE",
            headers: {
                "X-Server": subdomain + ".mxrouting.net",
                "X-Username": user,
                "X-API-Key": key
            }
        });
        const data = await mxrouteRes.json();
        res.status(mxrouteRes.status).json(data);
    }
    catch (err) {
        console.error("Proxy error:", err);
        res.status(500).json({ error: "Internal proxy error" });
    }
});


// start server
app.listen(PORT, () => {
    console.log("proxy running at http://localhost:" + PORT);
});