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

    // Get the error message element
    const errorMessageElement = document.getElementById("error-message");

    // Get expense name, amount, and category from form
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseCategorySelect = document.getElementById("expense-category");
    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value);
    const expenseCategory = expenseCategorySelect.value;

    // Clear form inputs
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    expenseCategorySelect.selectedIndex = 0;  // Resets the dropdown to the first option

    // Validate inputs
    if (expenseName === "" || expenseName.length > 20) {
        errorMessageElement.textContent = "Please enter a valid expense name (1-20 characters).";
        errorMessageElement.style.display = "block"; // Show the error message
        return;
    }
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
        errorMessageElement.textContent = "Please enter a valid expense amount (greater than 0).";
        errorMessageElement.style.display = "block"; // Show the error message
        return;
    }

    // If input is valid, hide the error message
    errorMessageElement.style.display = "none";

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

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginErrorMessage = document.getElementById('login-error-message');

    if (username === "admin" && password === "password") { // Replace with secure validation in production
        document.getElementById('login-container').style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        renderExpenses();  // Render expenses if login is successful
    } else {
        loginErrorMessage.textContent = "Invalid username or password";
        loginErrorMessage.style.display = 'block';
    }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginErrorMessage = document.getElementById('login-error-message');

    if (username === "admin" && password === "password") {
        document.getElementById('login-container').style.display = 'none';  // Hide login form
        document.querySelector('.container').style.display = 'block';  // Show the main container
        renderExpenses();  // Render expenses if login is successful
    } else {
        loginErrorMessage.textContent = "Invalid username or password";
        loginErrorMessage.style.display = 'block';
    }
});


// Hide the main content initially
document.querySelector('.container').style.display = 'none';
  
// Render initial expenses on page load 
renderExpenses();