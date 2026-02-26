let bills = JSON.parse(localStorage.getItem("bills")) || [];
let purchases = JSON.parse(localStorage.getItem("purchases")) || [];

const billsList = document.getElementById("billsList");
const purchaseList = document.getElementById("purchaseList");
const paycheckInput = document.getElementById("paycheck");
const savingsGoalInput = document.getElementById("savingsGoal");

function saveData() {
  localStorage.setItem("bills", JSON.stringify(bills));
  localStorage.setItem("purchases", JSON.stringify(purchases));
}

function addItem(type) {
  let name, amount;

  if(type === "bills") {
    name = document.getElementById("newBill").value;
    amount = document.getElementById("billAmount").value;
    if(name && amount) bills.push({name, amount: parseFloat(amount)});
  } else {
    name = document.getElementById("newPurchase").value;
    amount = document.getElementById("purchaseAmount").value;
    if(name && amount) purchases.push({name, amount: parseFloat(amount)});
  }

  saveData();
  render();
}

function deleteItem(type, index) {
  if(type === "bills") bills.splice(index,1);
  else purchases.splice(index,1);
  saveData();
  render();
}

function render() {
  billsList.innerHTML = "";
  purchaseList.innerHTML = "";

  bills.forEach((item, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.innerHTML = `${item.name} - $${item.amount}
      <button class="delete-btn" onclick="deleteItem('bills', ${index})">Delete</button>`;
    billsList.appendChild(li);
  });

  purchases.forEach((item, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.innerHTML = `${item.name} - $${item.amount}
      <button class="delete-btn" onclick="deleteItem('purchases', ${index})">Delete</button>`;
    purchaseList.appendChild(li);
  });

  calculateBalance();
}

function calculateBalance() {
  const paycheck = parseFloat(paycheckInput.value) || 0;
  const totalBills = bills.reduce((sum, item) => sum + item.amount, 0);
  const totalPurchases = purchases.reduce((sum, item) => sum + item.amount, 0);
  const remaining = paycheck - totalBills - totalPurchases;

  document.getElementById("remaining").textContent = "$" + remaining.toFixed(2);

  const goal = parseFloat(savingsGoalInput.value) || 0;
  if(goal > 0) {
    const percent = Math.min((remaining / goal) * 100, 100);
    document.getElementById("progress").style.width = percent + "%";
  }
}

paycheckInput.addEventListener("input", calculateBalance);
savingsGoalInput.addEventListener("input", calculateBalance);

render();
