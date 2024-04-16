document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // This is a mock login check
    if(username === "admin" && password === "admin") {
        window.location.href = 'dashboard.html';
    } else {
        alert("Invalid credentials!");
    }
});
