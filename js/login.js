// Redirect to home (index.html) when the "Home" link is clicked
document.getElementById('backToHome').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default anchor behavior
    window.location.href = '../index.html';  // Redirect to index page
});

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (username && password) {
        const loginData = {
            login: username,
            password: password
        };

        try {
            const response = await fetch('http://cop4331team24.online/LAMPAPI/Login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.error === "") {
                // Store user information such as user ID
                localStorage.setItem('userId', result.id);
                localStorage.setItem('firstName', result.firstName);
                localStorage.setItem('lastName', result.lastName);

                // Redirect to the home page
                window.location.href = '/pages/home.html';
            } else {
                document.getElementById('loginMessage').textContent = 'Invalid username or password!';
            }

        } catch (error) {
            document.getElementById('loginMessage').textContent = 'Server error. Please try again later.';
        }
    } else {
        document.getElementById('loginMessage').textContent = 'Please fill in all fields!';
    }
});