const apiBaseURL = "http://cop4331team24.online/LAMPAPI";
let userId = localStorage.getItem('userId');  // Stored the userId after login
let editContactId = null;  // Track the contact being edited


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

// Redirect to home (index.html) when the "Home" link is clicked
document.getElementById('backToHome').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default anchor behavior
    window.location.href = '../index.html';  // Redirect to index page
});

// Logout functionality
document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent default anchor behavior

    // Clear session data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');

    // Optionally clear any other session-related data here
    // ...

    // Redirect to login or home page
    window.location.href = '../index.html';
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

// Show the add contact form when clicking "Add a Contact"
document.getElementById('addContactBtn').addEventListener('click', function() {
    const addContactForm = document.getElementById('addContactForm');
    addContactForm.style.display = addContactForm.style.display === 'none' ? 'block' : 'none';

    // Clear the form and reset the editContactId when clicking Add a Contact
    document.getElementById('addContactFormElement').reset();
    editContactId = null;  // Reset the contact being edited
});

// Separate function to retrieve contacts from the API
async function getContacts(query = '') {
    const searchBody = {
        name: query,
        userId: parseInt(userId)
    };

    const data = await apiRequest('/SearchContact.php', 'POST', searchBody);
    return data.results || [];
}

// Load and display contacts (Search)
async function loadContacts(query = '') {
    const contacts = await getContacts(query);
    
    if (contacts) {
        displayContacts(contacts);
    } else {
        document.getElementById('contactsList').innerHTML = '<tr><td colspan="5">No contacts found.</td></tr>';
    }
}

// Display contacts in the table
function displayContacts(contacts) {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';  // Clear the existing list

    contacts.forEach((contact) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>
                <button onclick="editContact(${contact.name})">Edit</button>
                <button onclick="deleteContact(${contact.name})">Delete</button>
            </td>
        `;
        contactsList.appendChild(row);
    });
}

// Add or edit a contact via form submission
document.getElementById('addContactFormElement').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;

    const contactData = {
        contact: { firstName, lastName, phone, email },
        userId: parseInt(userId)
    };

    try {
        if (editContactId !== null) {
            // Editing an existing contact
            contactData.contact.id = editContactId;  // Add the contact's ID to the request
            await apiRequest('/editContact.php', 'POST', contactData);
        } else {
            // Adding a new contact
            await apiRequest('/AddContact.php', 'POST', contactData);
        }

        // Clear form and reset the ID after submission
        document.getElementById('addContactFormElement').reset();
        document.getElementById('addContactForm').style.display = 'none';  // Hide form after submission
        editContactId = null;

        // Reload contact list
        loadContacts();
    } catch (error) {
        console.error('Error adding/editing contact:', error);
    }
});

// Delete a contact
async function deleteContact(id) {
    const deleteBody = {
        userId: parseInt(userId),
        id: id
    };

    await apiRequest('/DeleteContact.php', 'POST', deleteBody);
    loadContacts();
}

// Edit a contact (populate form with existing data)
async function editContact(name) {
    const contacts = await getContacts();  // Fetch contacts again to find the contact to edit
    const contact = contacts.find(contact => contact.name === name);

    if (contact) {
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('phoneNumber').value = contact.phone;
        document.getElementById('email').value = contact.email;

        editContactId = id;  // Set the contact ID being edited
        document.getElementById('addContactForm').style.display = 'block';  // Show the form for editing
    }
}

// Search contacts dynamically on keyup or when clicking the search button
function searchContacts() {
    const query = document.getElementById('searchText').value;
    loadContacts(query);
}

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    loadContacts();
});
