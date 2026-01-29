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