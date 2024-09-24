const form = document.getElementById('registrationForm');
const entriesBody = document.getElementById('entriesBody');
const dobField = document.getElementById('dob');
const today = new Date();


const maxAge = 18;
const minAge = 55;


const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate()).toISOString().split('T')[0];
const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate()).toISOString().split('T')[0];

dobField.setAttribute('min', maxDate);
dobField.setAttribute('max', minDate);

dobField.addEventListener('change', function() {
    if (!validateDOB(dobField.value)) {
        dobField.disabled = true;
        dobField.value = '';
        dobField.style.backgroundColor = '#e5e7eb';
    } else {
        dobField.disabled = false;
        dobField.style.backgroundColor = '';
    }
});


window.onload = function() {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
        savedData.forEach(data => addEntryToTable(data));
    }
};

form.addEventListener('submit', function(event) {
    event.preventDefault();

    clearErrors();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const dob = document.getElementById('dob').value;
    const termsAccepted = document.getElementById('terms').checked;


    if (!validateEmail(email)) {
        showError('emailError', 'Please enter a valid email.');
        return;
    }

    if (!validateDOB(dob)) {
        showError('dobError', 'You must be between 18 and 55 years old.');
        return;
    }

    if (!termsAccepted) {
        showError('termsError', 'You must accept the terms and conditions.');
        return;
    }


    const formData = {
        name,
        email,
        password,
        dob,
        termsAccepted: termsAccepted ? 'Yes' : 'No'
    };
    saveDataToLocal(formData);

    addEntryToTable(formData);


    form.reset();
});


function saveDataToLocal(data) {
    let savedData = JSON.parse(localStorage.getItem('formData')) || [];
    savedData.push(data);
    localStorage.setItem('formData', JSON.stringify(savedData));
}


function addEntryToTable(data) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.password}</td>
        <td>${data.dob}</td>
        <td>${data.termsAccepted}</td>
    `;
    entriesBody.appendChild(row);
}


function validateEmail(email) {
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    return emailPattern.test(email);
}


function validateDOB(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }
    return age >= 18 && age <= 55;
}

function showError(id, message) {
    const errorElement = document.getElementById(id);
    errorElement.textContent = message;
}
function clearErrors() {
    document.querySelectorAll('.error').forEach(errorElement => {
        errorElement.textContent = '';
    });
}
