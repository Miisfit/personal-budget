function addBill() {
  const name = document.getElementById("newBill").value;
  const amount = document.getElementById("billAmount").value;

  if(name && amount) {
    const li = document.createElement("li");
    li.textContent = `${name} - $${amount}`;
    document.getElementById("billsList").appendChild(li);
  }
}

function addPurchase() {
  const name = document.getElementById("newPurchase").value;
  const amount = document.getElementById("purchaseAmount").value;

  if(name && amount) {
    const li = document.createElement("li");
    li.textContent = `${name} - $${amount}`;
    document.getElementById("purchaseList").appendChild(li);
  }
}
