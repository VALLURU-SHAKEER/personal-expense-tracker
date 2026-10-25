
const categoryFilter = document.getElementById("category-filter");
const form = document.getElementById("expense-form");
const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const dateInput = document.getElementById("expense-date");
const categoryInput = document.getElementById("expense-category");
const expenseItems = document.getElementById("expense-items");
const totalExpenses = document.getElementById("total-expenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateTotal() {
    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    totalExpenses.textContent = total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });
}

function displayExpenses() {
    expenseItems.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    const filteredExpenses = selectedCategory === "All"
        ? expenses
        : expenses.filter(
            expense => expense.category === selectedCategory
        );

    if (filteredExpenses.length === 0) {
        const message = document.createElement("li");
        message.id = "empty-message";

        message.textContent = expenses.length === 0
            ? "No expenses added yet."
            : "No expenses found in this category.";

        expenseItems.appendChild(message);
        updateTotal();
        return;
    }

    filteredExpenses.forEach((expense) => {
        const item = document.createElement("li");
        item.className = "expense-item";

        const details = document.createElement("div");
        details.className = "expense-details";

        const title = document.createElement("strong");
        title.textContent = expense.name;

        const date = document.createElement("small");
        date.textContent = expense.date || "No date";

        const category = document.createElement("small");
        category.textContent = expense.category;

        const amount = document.createElement("div");
        amount.textContent = expense.amount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR"
        });

        details.appendChild(title);
        details.appendChild(date);
        details.appendChild(category);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            expenses = expenses.filter(
                entry => entry.id !== expense.id
            );

            localStorage.setItem("expenses", JSON.stringify(expenses));
            displayExpenses();
        });

        item.appendChild(details);
        item.appendChild(amount);
        item.appendChild(deleteButton);

        expenseItems.appendChild(item);
    });

    updateTotal();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (
        !name ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !date ||
        !category
    ) {
        alert("Please enter valid expense details.");
        return;
    }

    expenses.push({
        id: Date.now() + Math.random(),
        name: name,
        amount: amount,
        category: category,
        date: date
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    form.reset();
    displayExpenses();
});

categoryFilter.addEventListener("change", displayExpenses);

displayExpenses();
