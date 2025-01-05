alert("😊 Welcome to Budget-H, manage your budgets here");
// DOM Elements
var bala = document.getElementById("balance");
var creda = document.getElementById("balancec");
var debia = document.getElementById("balanced");
var balsa = document.getElementById("balances");
var spl = document.getElementById("balancesl");
var listContainer = document.getElementById("listcontainer");

// Initialize data from local storage
function initializeData() {
    bala.innerHTML = localStorage.getItem("balance") || 0;
    creda.innerHTML = localStorage.getItem("credited") || 0;
    debia.innerHTML = localStorage.getItem("debited") || 0;
    balsa.innerHTML = localStorage.getItem("savings") || 0;
    spl.innerHTML = localStorage.getItem("spendingLimit") || 0;

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.forEach(transaction => createTransaction(transaction.type, transaction.amount, transaction.reason, transaction.timestamp));
}

// Save data to local storage
function saveData() {
    localStorage.setItem("balance", bala.innerHTML);
    localStorage.setItem("credited", creda.innerHTML);
    localStorage.setItem("debited", debia.innerHTML);
    localStorage.setItem("savings", balsa.innerHTML);
    localStorage.setItem("spendingLimit", spl.innerHTML);
}

// Save transactions to local storage
function saveTransaction(type, amount, reason, timestamp) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push({ type, amount, reason, timestamp });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to create a transaction entry (credit or debit)
function createTransaction(type, amount, reason = "", timestamp = new Date().toLocaleString()) {
    var listItem = document.createElement("li");
    listItem.className = type;
    listItem.style.backgroundColor = type === "credit" ? "lightgreen" : "lightcoral";

    // Delete button
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "✕";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function () {
        listContainer.removeChild(listItem);
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions = transactions.filter(t => t.timestamp !== timestamp);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    };

    // Reason input
    var reasonInput = document.createElement("input");
    reasonInput.type = "text";
    reasonInput.placeholder = "Enter reason...";
    reasonInput.value = reason;
    reasonInput.className = "reason-input";
    reasonInput.oninput = function () {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        let transaction = transactions.find(t => t.timestamp === timestamp);
        if (transaction) transaction.reason = reasonInput.value;
        localStorage.setItem("transactions", JSON.stringify(transactions));
    };

    // Amount display
    var amountSpan = document.createElement("span");
    amountSpan.innerHTML = `₹${amount}`;

    // Timestamp
    var timestampSpan = document.createElement("span");
    timestampSpan.innerHTML = timestamp;
    timestampSpan.style.marginLeft = "auto";
    timestampSpan.style.fontSize = "12px";
    timestampSpan.style.color = "#555";

    // Append elements
    listItem.append(deleteButton, reasonInput, amountSpan, timestampSpan);
    listContainer.appendChild(listItem);

    // Save transaction
    if (!reason) saveTransaction(type, amount, reason, timestamp);
}

// Function to handle account balance
function bal() {
    var prom1 = prompt("Enter the amount in your account:");
    if (prom1 !== null) {
        bala.innerHTML = Number(prom1);
        saveData();
    }
}

// Function to handle savings
function bals() {
    var con1 = confirm("To add to your existing savings - 'OK', to reset your savings - 'CANCEL'");
    if (con1) {
        var prom10 = prompt("Enter the amount to add to savings:");
        if (prom10) {
            balsa.innerHTML = Number(balsa.innerHTML) + Number(prom10);
            saveData();
        }
    } else {
        var prom1 = prompt("Reset your savings amount:");
        if (prom1) {
            balsa.innerHTML = Number(prom1);
            saveData();
        }
    }
}

// Function to handle crediting the account
function cred() {
    var con3 = confirm("Add to your existing credit - 'OK', reset your credit - 'CANCEL'");
    if (con3) {
        var prom40 = prompt("Enter the amount credited:");
        if (prom40) {
            creda.innerHTML = Number(creda.innerHTML) + Number(prom40);
            bala.innerHTML = Number(bala.innerHTML) + Number(prom40);
            createTransaction("credit", prom40);
            saveData();
        }
    } else {
        var prom4 = prompt("Enter your new credit amount:");
        if (prom4) {
            creda.innerHTML = Number(prom4);
            saveData();
        }
    }
}

// Function to handle spending limit
function sl() {
    var prom2 = prompt("Enter your spending limit:");
    if (prom2) {
        spl.innerHTML = Number(prom2);
        saveData();
    }
}

// Function to handle debiting the account
function debi() {
    if (Number(spl.innerHTML) === 0 || Number(debia.innerHTML) < Number(spl.innerHTML)) {
        var con4 = confirm("Add to your existing debit - 'OK', reset your debit - 'CANCEL'");
        if (con4) {
            var prom50 = prompt("Enter the amount debited:");
            if (prom50) {
                debia.innerHTML = Number(debia.innerHTML) + Number(prom50);
                bala.innerHTML = Number(bala.innerHTML) - Number(prom50);
                createTransaction("debit", prom50);
                saveData();
            }
        } else {
            var prom5 = prompt("Enter your new debit amount:");
            if (prom5) {
                debia.innerHTML = Number(prom5);
                saveData();
            }
        }
    } else {
        alert("You are spending more than your limit!");
    }
}
var listContainer = document.getElementById("listcontainer");

// Load stored list items on page load
window.onload = function () {
    loadTransactions();
};

// Function to save a transaction to localStorage
function saveTransactions() {
    const transactions = [];
    const listItems = listContainer.querySelectorAll("li");
    listItems.forEach((item) => {
        transactions.push({
            type: item.className,
            amount: item.querySelector("span").innerText.replace("₹", ""),
            reason: item.querySelector("input").value,
            timestamp: item.querySelector("span:last-child").innerText,
        });
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to load transactions from localStorage
function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (storedTransactions) {
        listContainer.innerHTML = ""; // Clear existing items to avoid duplication
        storedTransactions.forEach((transaction) => {
            createTransaction(transaction.type, transaction.amount, transaction.reason, transaction.timestamp);
        });
    }
}

// Function to create a transaction entry (credit or debit)
function createTransaction(type, amount, reason = "", timestamp = null) {
    const listItem = document.createElement("li");
    listItem.className = type;
    listItem.style.backgroundColor = type === "credit" ? "lightgreen" : "lightcoral";
    listItem.style.display = "flex";
    listItem.style.alignItems = "center";
    listItem.style.padding = "10px";
    listItem.style.marginBottom = "5px";
    listItem.style.borderRadius = "5px";

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "✕";
    deleteButton.className = "delete-btn";
    deleteButton.style.marginRight = "10px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.background = "none";
    deleteButton.style.border = "none";
    deleteButton.style.color = "red";

    deleteButton.onclick = function () {
        listContainer.removeChild(listItem);
        saveTransactions(); // Update storage after deletion
    };

    // Input box for reason
    // Input box for reason
    const reasonInput = document.createElement("input");
    reasonInput.type = "text";
    reasonInput.placeholder = "Enter reason...";
    reasonInput.className = "reason-input";
    reasonInput.style.flexGrow = "0";
    reasonInput.style.marginLeft = "10px";
    reasonInput.style.marginRight = "10px";
    reasonInput.style.padding = "5px";
    reasonInput.style.border = "1px solid #ccc";
    reasonInput.style.borderRadius = "3px";
    reasonInput.value = reason;

// Add an 'oninput' event to save changes to local storage
    reasonInput.oninput = function () {
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        const transaction = transactions.find(t => t.timestamp === timestamp);

        if (transaction) {
            transaction.reason = reasonInput.value; // Update reason in the specific transaction
            localStorage.setItem("transactions", JSON.stringify(transactions)); // Save back to localStorage
        }
    };


    // Amount display
    const amountSpan = document.createElement("span");
    amountSpan.innerHTML = `₹${amount}`;
    amountSpan.style.marginLeft = "4px";

    // Timestamp
    const timestampSpan = document.createElement("span");
    if (!timestamp) {
        const now = new Date();
        timestamp = now.toLocaleString(); // Generate timestamp if not provided
    }
    timestampSpan.innerHTML = timestamp;
    timestampSpan.style.marginLeft = "auto";
    timestampSpan.style.fontSize = "12px";
    timestampSpan.style.color = "#555";

    // Append elements
    listItem.append(deleteButton);
    listItem.append(reasonInput);
    listItem.append(amountSpan);
    listItem.append(timestampSpan);
    listContainer.appendChild(listItem);

    saveTransactions(); // Save to localStorage
}

// Example: Call createTransaction to test
// createTransaction("credit", 100, "Salary");
// createTransaction("debit", 50, "Groceries");


// Initialize data on page load
initializeData();
// Redirect to chart page
function redirectToChartPage() {
    // Save the current transactions and balance data in localStorage (already done in your app)
    window.location.href = "./about.html"; // Ensure you create chart.html for the graph
}

