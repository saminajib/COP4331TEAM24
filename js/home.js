const apiBaseURL = "http://cop4331team24.online/LAMPAPI";
let userId = localStorage.getItem('userId');  // Stored the userId after login
let editContactName = null;  // Track the contact being edited (use name and phone as the identifier)
let editContactPhone = null;  // Track the phone number of the contact being edited


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

    localStorage.clear();  // Clear session data from localStorage

    // Redirect to login or home page
    window.location.href = '../index.html';
});

// Show the add contact form when clicking "Add a Contact"
document.getElementById('addContactBtn').addEventListener('click', function() {
    const addContactForm = document.getElementById('addContactForm');
    addContactForm.style.display = addContactForm.style.display === 'none' ? 'block' : 'none';

    // Clear the form and reset the editContactId when clicking Add a Contact
    document.getElementById('addContactFormElement').reset();
    editContactName = null;  // Reset the contact being edited
    editContactPhone = null;  // Reset the contact being edited
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

        // Create table cells for contact data
        const nameCell = document.createElement('td');
        nameCell.textContent = contact.name;

        const emailCell = document.createElement('td');
        emailCell.textContent = contact.email;

        const phoneCell = document.createElement('td');
        phoneCell.textContent = contact.phone;

        // Create action cell (Edit and Delete buttons)
        const actionCell = document.createElement('td');

        // Create Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editContact(contact.name, contact.phone));  // Attach event listener

        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteContact(contact.name));  // Attach event listener

        // Append buttons to the action cell
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Append all cells to the row
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(actionCell);

        row.setAttribute('data-name', contact.name);
        row.setAttribute('data-phone', contact.phone);

        // Append the row to the contacts table
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
            await apiRequest('/editContact.php', 'POST', contactData);
            updateContactInTable(editContactName, editContactPhone, name, email, phone);
        } else {
            // Adding a new contact
            await apiRequest('/AddContact.php', 'POST', contactData);
            loadContacts();
        }

        // Clear form and reset the ID after submission
        document.getElementById('addContactFormElement').reset();
        document.getElementById('addContactForm').style.display = 'none';  // Hide form after submission
        editContactName = null;
        editContactPhone = null;
    } catch (error) {
        console.error('Error adding/editing contact:', error);
    }
});

// Function to immediately update the contact in the frontend table
function updateContactInTable(originalName, originalPhone, newName, newEmail, newPhone) {
    const rows = document.querySelectorAll('#contactsList tr');

    rows.forEach(row => {
        if (row.getAttribute('data-name') === originalName && row.getAttribute('data-phone') === originalPhone) {
            // Update the table row with the new values
            row.querySelector('td:nth-child(1)').textContent = newName;
            row.querySelector('td:nth-child(2)').textContent = newEmail;
            row.querySelector('td:nth-child(3)').textContent = newPhone;

            // Update the row's data attributes to reflect the new values
            row.setAttribute('data-name', newName);
            row.setAttribute('data-phone', newPhone);
        }
    });
}

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
async function editContact(name, phone) {
    const contacts = await getContacts();  // Fetch contacts again to find the contact to edit
    const contact = contacts.find(contact => contact.name === name && contact.phone === phone);  // Use name and phone

    if (contact) {
        document.getElementById('name').value = contact.name;
        document.getElementById('phoneNumber').value = contact.phone;
        document.getElementById('email').value = contact.email;

        editContactName = name;  // Set the contact name being edited
        editContactPhone = phone;  // Set the contact phone being edited
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
