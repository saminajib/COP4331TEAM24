// Redirect to home (index.html) when the "Home" link is clicked
document.getElementById('backToHome').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default anchor behavior
    window.location.href = '../index.html';  // Redirect to index page
});

// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    if (username && password && firstName && lastName) {
        const signUpData = {
            login: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        };

        try {
            const response = await fetch('http://cop4331team24.online/LAMPAPI/SignUp.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signUpData)
            });

            const result = await response.json();

            if (result.error === "") {
                document.getElementById('message').textContent = 'Registration successful!';
                document.getElementById('registerForm').reset();
            } else if (result.error === "Username taken") {
                document.getElementById('message').textContent = 'Username already taken!';
            } else {
                document.getElementById('message').textContent = 'Registration failed!';
            }

        } catch (error) {
            document.getElementById('message').textContent = 'Server error. Please try again later.';
        }
    } else {
        document.getElementById('message').textContent = 'Please fill in all fields!';
    }
});