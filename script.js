document.addEventListener("DOMContentLoaded", function () {
  const listEl = document.getElementById("transaction-list");
  const incomeEl = document.getElementById("income").querySelector("span");
  const expenseEl = document.getElementById("expense").querySelector("span");
  const totalEl = document.getElementById("total").querySelector("span");

  const typeFilter = document.getElementById("type-filter");
  const categoryFilter = document.getElementById("category-filter");
  const dateFilter = document.getElementById("date-filter");
  const datePicker = document.getElementById("date-picker");

  // Create month and week inputs dynamically
  const monthInput = document.createElement("input");
  monthInput.type = "month";
  monthInput.style.display = "none";
  dateFilter.parentNode.insertBefore(monthInput, datePicker);

  const weekInput = document.createElement("input");
  weekInput.type = "week";
  weekInput.style.display = "none";
  dateFilter.parentNode.insertBefore(weekInput, datePicker);

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  function updateSummary(filtered) {
    let income = 0, expense = 0;
    filtered.forEach(t => {
      if (t.type === "income") income += Number(t.amount);
      else expense += Number(t.amount);
    });
    incomeEl.textContent = income;
    expenseEl.textContent = expense;
    totalEl.textContent = income - expense;
  }

  function getWeekRange(year, week) {
    const d = new Date(year, 0, 1);
    const dayNum = d.getDay() || 7;
    d.setDate(d.getDate() + (week - 1) * 7 - (dayNum - 1));
    const start = new Date(d);
    const end = new Date(d);
    end.setDate(start.getDate() + 6);
    return [start, end];
  }

  function applyFilters() {
    let filtered = [...transactions];

    // Type filter
    if (typeFilter.value !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter.value);
    }

    // Category filter
    if (categoryFilter.value !== "all") {
      filtered = filtered.filter(t => t.category.toLowerCase() === categoryFilter.value.toLowerCase());
    }

    // Date filter
    if (dateFilter.value === "select" && datePicker.value) {
      filtered = filtered.filter(t => t.date === datePicker.value);
    } else if (dateFilter.value === "month" && monthInput.value) {
      filtered = filtered.filter(t => t.date.startsWith(monthInput.value));
    } else if (dateFilter.value === "week" && weekInput.value) {
      const [yearStr, weekStr] = weekInput.value.split("-W");
      const [start, end] = getWeekRange(Number(yearStr), Number(weekStr));
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
    }

    return filtered;
  }

  function render() {
    const filtered = applyFilters();
    listEl.innerHTML = "";

    if (filtered.length === 0) {
      listEl.innerHTML = `<p class="no-data">No transactions available</p>`;
    } else {
      filtered.forEach(t => {
        const li = document.createElement("li");
        li.className = t.type;

        const text = document.createElement("span");
        text.textContent = `${t.date} • ${t.category}${t.note ? " - " + t.note : ""}`;

        const amt = document.createElement("span");
        amt.textContent = `₹${t.amount}`;

        const del = document.createElement("button");
        del.className = "delete-btn";
        del.textContent = "❌";
        del.addEventListener("click", () => {
          transactions = transactions.filter(tr => tr !== t);
          localStorage.setItem("transactions", JSON.stringify(transactions));
          render();
        });

        li.appendChild(text);
        li.appendChild(amt);
        li.appendChild(del);
        listEl.appendChild(li);
      });
    }

    updateSummary(filtered);
  }

  // Show appropriate input for date type
  dateFilter.addEventListener("change", () => {
    datePicker.style.display = dateFilter.value === "select" ? "inline-block" : "none";
    monthInput.style.display = dateFilter.value === "month" ? "inline-block" : "none";
    weekInput.style.display = dateFilter.value === "week" ? "inline-block" : "none";
    render();
  });

  typeFilter.addEventListener("change", render);
  categoryFilter.addEventListener("change", render);
  datePicker.addEventListener("change", render);
  monthInput.addEventListener("change", render);
  weekInput.addEventListener("change", render);

  // Reset button function
  window.resetFilters = function () {
    typeFilter.value = "all";
    categoryFilter.value = "all";
    dateFilter.value = "date";

    datePicker.style.display = "none";
    monthInput.style.display = "none";
    weekInput.style.display = "none";

    datePicker.value = "";
    monthInput.value = "";
    weekInput.value = "";

    render();
  }

  render();
});
