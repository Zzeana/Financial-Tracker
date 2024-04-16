document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    console.log("Attempting login with", username, password); // Debug log

    if(username === "admin" && password === "admin") {
        console.log("Login successful, redirecting..."); // Debug log
        window.location.href = 'dashboard.html';
    } else {
        console.log("Login failed"); // Debug log
        alert("Invalid credentials!");
    }
});
