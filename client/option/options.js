document.addEventListener('DOMContentLoaded', function() {

    loadSettings();

    document.getElementById('configForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveSettings();
    });
});

function saveSettings() {
    const subdomain = document.getElementById('subdomain').value;
    const user = document.getElementById('user').value;
    const key = document.getElementById('key').value;
    const user_domain = document.getElementById('user_domain').value;
    const receiver = document.getElementById('receiver').value;
    const domainInfo = document.getElementById("domainInfo").checked ? 1 : 0;

    const config = {
        subdomain,
        user,
        key,
        user_domain,
        receiver,
        domainInfo
    };

    localStorage.setItem('config', JSON.stringify(config));
    alert('Settings saved!');
}

function loadSettings() {
    const config = JSON.parse(localStorage.getItem('config'));
    if (config) {
        document.getElementById('subdomain').value = config.subdomain;
        document.getElementById('user').value = config.user;
        document.getElementById('key').value = config.key;
        document.getElementById('user_domain').value = config.user_domain;
        document.getElementById('receiver').value = config.receiver;
        document.getElementById("domainInfo").checked = config.domainInfo;
    }
}