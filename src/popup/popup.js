document.getElementById("claim").addEventListener("click", () => {
    const response = fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
        method: "POST",
        body: JSON.stringify({act_id: "e202102251931481"}),
    });
    console.log(response);
})