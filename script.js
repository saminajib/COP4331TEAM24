const apiBaseURL = "http://cop4331team24.online/LAMPAPI";
let userId = 12; // This would be dynamically set after login
let editIndex = null;

// Helper function to make API requests
async function apiRequest(endpoint, method, body) {
    const response = await fetch(`${apiBaseURL}${endpoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

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

// Load contacts from local storage
async function loadContacts(query = '') {
    const searchBody = {
        name: query,
        userId: userId
    };

    const data = await apiRequest('/SearchContact.php', 'POST', searchBody);
    
    if (data.results) {
        displayContacts(data.results);
    } else {
        document.getElementById('contactList').innerHTML = '<li>No contacts found.</li>';
    }
}

// Display contacts
function displayContacts(contacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach((contact, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${contact.name} - ${contact.phone} - ${contact.email}
            <button onclick="editContact(${contact.id})">Edit</button>
            <button onclick="deleteContact(${contact.id})">Delete</button>
        `;
        contactList.appendChild(li);
    });
}

// Add or edit a contact
document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;

    const contactData = {
        contact: { name, phone, email },
        userId: userId
    };

    if (editIndex !== null) {
        // Editing an existing contact
        contactData.id = editIndex;
        await apiRequest('/editContact.php', 'POST', contactData);
        editIndex = null;
    } else {
        // Adding a new contact
        await apiRequest('/AddContact.php', 'POST', contactData);
    }

    document.getElementById('contactForm').reset();
    loadContacts(); // Refresh contact list
});

// Delete a contact
async function deleteContact(id) {
    const deleteBody = {
        userId: userId,
        id: id
    };

    await apiRequest('/DeleteContact.php', 'POST', deleteBody);
    loadContacts();
}

// Edit a contact
async function editContact(id) {
    const contacts = await loadContacts(); // fetch contacts again to find the contact to edit
    const contact = contacts.find(contact => contact.id === id);

    if (contact) {
        document.getElementById('contactName').value = contact.name;
        document.getElementById('contactPhone').value = contact.phone;
        document.getElementById('contactEmail').value = contact.email;
        editIndex = id;
    }
}

// Search contacts
document.getElementById('searchBar').addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    loadContacts(query);
});

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    loadContacts();
});
