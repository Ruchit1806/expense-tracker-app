document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("transaction-form");
  const refreshBtn = document.getElementById("refresh-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let note = document.getElementById("note").value;

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    let newTransaction = { amount, type, category, date, note };

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(newTransaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    alert("Transaction added!");
    form.reset();
  });

  // Refresh button clears the form
  refreshBtn.addEventListener("click", function () {
    form.reset();
  });
});
