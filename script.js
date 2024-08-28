// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const user = {
            username: username,
            password: password
        };

        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('message').textContent = 'Registration successful!';
        document.getElementById('registerForm').reset();
    } else {
        document.getElementById('message').textContent = 'Please fill in all fields!';
    }
});

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && username === storedUser.username && password === storedUser.password) {
        window.location.href = '/pages/home.html';
    } else {
        document.getElementById('loginMessage').textContent = 'Invalid username or password!';
    }
});


// Global variable to track editing
let editIndex = null;

// Load contacts from local storage
function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    return contacts;
}

// Save contacts to local storage
function saveContacts(contacts) {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Display contacts
function displayContacts(contacts) {
    const contactList = document.getElementById('contactList');
    contactList.innerHTML = '';

    contacts.forEach((contact, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${contact.name} - ${contact.phone}
            <button onclick="editContact(${index})">Edit</button>
            <button onclick="deleteContact(${index})">Delete</button>
        `;
        contactList.appendChild(li);
    });
}

// Add or edit a contact
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;

    let contacts = loadContacts();

    if (editIndex !== null) {
        // Editing an existing contact
        contacts[editIndex] = { name, phone };
        editIndex = null;
    } else {
        // Adding a new contact
        contacts.push({ name, phone });
    }

    saveContacts(contacts);
    displayContacts(contacts);
    document.getElementById('contactForm').reset();
});

// Delete a contact
function deleteContact(index) {
    let contacts = loadContacts();
    contacts.splice(index, 1);
    saveContacts(contacts);
    displayContacts(contacts);
}

// Edit a contact
function editContact(index) {
    let contacts = loadContacts();
    const contact = contacts[index];
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactPhone').value = contact.phone;
    editIndex = index;
}

// Search contacts
document.getElementById('searchBar').addEventListener('input', function(event) {
    const query = event.target.value.toLowerCase();
    let contacts = loadContacts();
    const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(query));
    displayContacts(filteredContacts);
});

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    const contacts = loadContacts();
    displayContacts(contacts);
});
