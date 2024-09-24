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
            <td>${contact.name}</td>
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

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;

    const contactData = {
        contact: { name, phone, email },
        userId: parseInt(userId)
    };

    try {
        if (editContactId !== null) {
            // Editing an existing contact
            contactData.contact.name = editContactId;  // Add the contact's ID to the request
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
async function deleteContact(name) {
    const deleteBody = {
        name: name,
        userId: userId
    };

    await apiRequest('/DeleteContact.php', 'POST', deleteBody);
    loadContacts();
}

// Edit a contact (populate form with existing data)
async function editContact(name) {
    const contacts = await getContacts();  // Fetch contacts again to find the contact to edit
    const contact = contacts.find(contact => contact.name === name);

    if (contact) {
        document.getElementById('name').value = contact.name;
        document.getElementById('phoneNumber').value = contact.phone;
        document.getElementById('email').value = contact.email;

        editContactId = name;  // Set the contact ID being edited
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
