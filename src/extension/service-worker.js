function getCookies(domain) {
    chrome.cookies.getAll({ domain: domain }, (cookies) => {
        console.log("Cookies from " + domain, cookies);
    });
}
