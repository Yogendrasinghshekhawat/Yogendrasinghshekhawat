const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currencycode in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = currencycode;
        newoption.value = currencycode;

        // Check class to identify which dropdown (from or to) we are dealing with
        if (select.classList.contains("from") && currencycode === "USD") {
            newoption.selected = "selected";
        } else if (select.classList.contains("to") && currencycode === "INR") {
            newoption.selected = "selected";
        }

        select.append(newoption);
    }

    // Update the flag when the dropdown value changes
    select.addEventListener("change", (evt) => {
        updateflag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        let data = await response.json();
        let rate = data[toCurr.value.toLowerCase()];
      
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Failed to fetch exchange rate.";
        console.error(error);
    }
};

const updateflag = (element) => {
    let currencycode = element.value;
    let countrycode = countryList[currencycode];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

// Attach the button click event to trigger the exchange rate update
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Update exchange rate on page load
window.addEventListener("load", () => {
    updateExchangeRate();
});



