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

app.listen(PORT, () => {
  console.log(`Proxy-Server läuft auf http://localhost:${PORT}`);
});