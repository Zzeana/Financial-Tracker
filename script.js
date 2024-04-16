const expenseForm = 
    document.getElementById("expense-form"); 
const expenseList = 
    document.getElementById("expense-list"); 
const totalAmountElement = 
    document.getElementById("total-amount"); 
  
// Initialize expenses array from localStorage 
let expenses =  
    JSON.parse(localStorage.getItem("expenses")) || []; 
  
function renderExpenses() {
    expenseList.innerHTML = ""; // Clear existing rows
    let totalAmount = 0;

    expenses.forEach((expense, i) => {
        const expenseRow = document.createElement("tr");
        expenseRow.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td class="delete-btn" data-id="${i}">Delete</td>
        `;
        expenseList.appendChild(expenseRow);
        totalAmount += expense.amount;
    });

    totalAmountElement.textContent = totalAmount.toFixed(2);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateChart(expenses); // Update chart with latest data
}

let categoryChart; // Global variable to hold the chart instance

function updateChart(expenses) {
    const categoryData = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categories = Object.keys(categoryData);
    const amounts = categories.map(category => categoryData[category]);

    const data = {
        labels: categories,
        datasets: [{
            label: 'Expense by Category',
            data: amounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    if (categoryChart) { // Check if chart instance already exists
        categoryChart.destroy(); // Destroy existing chart
    }
    categoryChart = new Chart(
        document.getElementById('categoryChart'),
        config
    );
}
  
// Function to add expense 
function addExpense(event) {
    event.preventDefault();

    // Get expense name, amount, and category from form
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseCategorySelect = document.getElementById("expense-category");
    const expenseName = expenseNameInput.value;
    const expenseAmount = parseFloat(expenseAmountInput.value);
    const expenseCategory = expenseCategorySelect.value;

    // Clear form inputs
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    expenseCategorySelect.selectedIndex = 0;  // Resets the dropdown to the first option

    // Validate inputs
    if (expenseName === "" || isNaN(expenseAmount)) {
        alert("Please enter valid expense details.");
        return;
    }

    // Create new expense object
    const expense = {
        name: expenseName,
        amount: expenseAmount,
        category: expenseCategory
    };

    // Add expense to expenses array
    expenses.push(expense);

    // Render expenses
    renderExpenses();
}
  


// Function to delete expense 
function deleteExpense(event) { 
    if (event.target.classList.contains("delete-btn")) { 
  
        // Get expense index from data-id attribute 
        const expenseIndex = 
            parseInt(event.target.getAttribute("data-id")); 
  
        // Remove expense from expenses array 
        expenses.splice(expenseIndex, 1); 
  
        // Render expenses 
        renderExpenses(); 
    } 
} 
  
// Add event listeners 
expenseForm.addEventListener("submit", addExpense); 
expenseList.addEventListener("click", deleteExpense); 
  
// Render initial expenses on page load 
renderExpenses();