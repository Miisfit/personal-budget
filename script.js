let data = JSON.parse(localStorage.getItem("budgetData")) || {};

const monthPicker = document.getElementById("monthPicker");
const paycheckInput = document.getElementById("paycheck");
const savingsGoalInput = document.getElementById("savingsGoal");
const billsList = document.getElementById("billsList");
const purchaseList = document.getElementById("purchaseList");
let chart;

monthPicker.valueAsDate = new Date();

function getMonthData() {
  const month = monthPicker.value;
  if (!data[month]) {
    data[month] = { paycheck: 0, savingsGoal: 0, bills: [], purchases: [] };
  }
  return data[month];
}

function saveData() {
  localStorage.setItem("budgetData", JSON.stringify(data));
}

function render() {
  const monthData = getMonthData();
  billsList.innerHTML = "";
  purchaseList.innerHTML = "";

  paycheckInput.value = monthData.paycheck;
  savingsGoalInput.value = monthData.savingsGoal;

  monthData.bills.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.amount}
      <button class="delete-btn" onclick="deleteItem('bills', ${index})">Delete</button>`;
    billsList.appendChild(li);
  });

  monthData.purchases.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - $${item.amount}
      <button class="delete-btn" onclick="deleteItem('purchases', ${index})">Delete</button>`;
    purchaseList.appendChild(li);
  });

  calculateBalance();
  updateChart();
}

function addItem(type) {
  const monthData = getMonthData();
  let name, amount;

  if(type === "bills") {
    name = document.getElementById("newBill").value;
    amount = document.getElementById("billAmount").value;
    if(name && amount) monthData.bills.push({name, amount: parseFloat(amount)});
  } else {
    name = document.getElementById("newPurchase").value;
    amount = document.getElementById("purchaseAmount").value;
    if(name && amount) monthData.purchases.push({name, amount: parseFloat(amount)});
  }

  saveData();
  render();
}

function deleteItem(type, index) {
  const monthData = getMonthData();
  monthData[type].splice(index,1);
  saveData();
  render();
}

function calculateBalance() {
  const monthData = getMonthData();
  monthData.paycheck = parseFloat(paycheckInput.value) || 0;
  monthData.savingsGoal = parseFloat(savingsGoalInput.value) || 0;

  const totalBills = monthData.bills.reduce((s,i)=>s+i.amount,0);
  const totalPurchases = monthData.purchases.reduce((s,i)=>s+i.amount,0);
  const remaining = monthData.paycheck - totalBills - totalPurchases;

  document.getElementById("remaining").textContent = "$" + remaining.toFixed(2);

  if(monthData.savingsGoal > 0) {
    const percent = Math.min((remaining / monthData.savingsGoal)*100,100);
    document.getElementById("progress").style.width = percent + "%";
  }

  saveData();
}

function updateChart() {
  const monthData = getMonthData();
  const totalBills = monthData.bills.reduce((s,i)=>s+i.amount,0);
  const totalPurchases = monthData.purchases.reduce((s,i)=>s+i.amount,0);

  const ctx = document.getElementById("budgetChart").getContext("2d");

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Bills", "Purchases", "Remaining"],
      datasets: [{
        data: [
          totalBills,
          totalPurchases,
          monthData.paycheck - totalBills - totalPurchases
        ],
        backgroundColor: ["#ff3b30", "#ff9500", "#34c759"]
      }]
    }
  });
}

monthPicker.addEventListener("change", render);
paycheckInput.addEventListener("input", calculateBalance);
savingsGoalInput.addEventListener("input", calculateBalance);

render();
