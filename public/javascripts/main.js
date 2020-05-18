/* Countdown timer. Page takes about 1 sec to load
Redirect from error pages to the Home page
 */
let seconds = 6;
redirect = () => {
    if (seconds <=0){
        window.location = '/';
    } else {
        seconds--;
        document.getElementById('pageInfo').innerHTML='Redirecting to Home Page after '+seconds+' seconds.';
        setTimeout("redirect()", 1000);
    }
};

/* Hide flash message after 3 sec */
window.setTimeout("document.getElementById('alert').style.display='none';", 3000);

/* Errors on registration form */
let register_errors = {};

const first_name = document.getElementById('first_name');
/* Validate first name */
first_name.addEventListener('change', (e) => {
    const first_name_error = document.getElementById('first_name_error');

    if (first_name.value.length !== 0 && first_name.value === ' ') {
        first_name_error.innerText = 'First name is not valid';
        register_errors.first_name_error = true;
    } else {
        first_name_error.innerText = '';
        delete register_errors.first_name_error;
    }
});

const last_name = document.getElementById('last_name');
/* Validate last name */
last_name.addEventListener('change', (e) => {
    const last_name_error = document.getElementById('last_name_error');

    if (last_name.value.length !== 0 && first_name.value === ' ') {
        last_name_error.innerText = 'Last name is not valid';
        register_errors.last_name_error = true;
    } else {
        last_name_error.innerText = '';
        delete register_errors.last_name_error;
    }
});

const username = document.getElementById('username');
/* Validate username name */
username.addEventListener('change', (e) => {
    const username_error = document.getElementById('username_error');

    if (username.value.length < 3) {
        username_error.innerText = 'Username is too short';
        register_errors.username_error = true;
    } else {
        username_error.innerText = '';
        delete register_errors.username_error;
    }
});

const email = document.getElementById('email');
/* Validate user email */
email.addEventListener('change', (e) => {
    const email_error = document.getElementById('email_error');

    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{0}$/;
    if (re.test(email.value)) {
        email_error.innerText = 'Email is not valid';
        register_errors.email_error = true;
    } else {
        email_error.innerText = '';
        delete register_errors.email_error;
    }
});

const password = document.getElementById('password');
/* Validate user password */
password.addEventListener('change', (e) => {
    const password_error = document.getElementById('password_error');

    if (password.value.length < 5) {
        password_error.innerText = 'Passwords should be longer then 5 characters';
        register_errors.password_error = true;
    } else {
        password_error.innerText = '';
        delete register_errors.password_error;
    }

    validate_confirm();
});

validate_confirm = () => {
    const confirm = document.getElementById('confirm');
    const confirm_error = document.getElementById('confirm_error');

    if (password.value !== confirm.value) {
        confirm_error.innerText = 'Passwords should match';
        register_errors.confirm_error = true;
    } else {
        confirm_error.innerText = '';
        delete register_errors.confirm_error;
    }
};

confirm.addEventListener('change', (e) => {
    validate_confirm();
});

const register_form = document.getElementById('register_form');
register_form.addEventListener('submit', (e) => {
    if (Object.keys(register_errors).length === 0 && password.value === confirm.value) {
        return register_form.submit();
    }
    e.preventDefault();
});
