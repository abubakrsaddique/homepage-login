const signupButton = document.getElementById('signup-link');
const loginButton = document.getElementById('login-link');

signupButton.addEventListener('click', () => {
    signupButton.classList.add('clicked');
    loginButton.classList.remove('clicked');
});

loginButton.addEventListener('click', () => {
    loginButton.classList.add('clicked');
    signupButton.classList.remove('clicked');
});

const authForm = document.getElementById('auth-form');
const authUsername = document.getElementById('auth-username');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authConfirmPassword = document.getElementById('auth-confirm-password');
const authSubmit = document.getElementById('auth-submit');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');

const toggleForms = (activeForm) => {
    authForm.classList.remove('active');
    activeForm.classList.add('active');
};

signupLink.addEventListener('click', () => {
    toggleForms(authForm);
    authEmail.style.display = 'block';
    authConfirmPassword.style.display = 'block';
    authSubmit.textContent = 'Sign Up';
    authUsername.setAttribute('placeholder', 'Username');
    authEmail.setAttribute('placeholder', 'Email');
    authPassword.setAttribute('placeholder', 'Password');
    authConfirmPassword.setAttribute('placeholder', 'Confirm Password');
    authEmail.setAttribute('required', 'required');
    authConfirmPassword.setAttribute('required', 'required');
});

loginLink.addEventListener('click', () => {
    toggleForms(authForm);
    authEmail.style.display = 'none';
    authConfirmPassword.style.display = 'none';
    authSubmit.textContent = 'Login';
    authUsername.setAttribute('placeholder', 'Username / Email');
    authEmail.removeAttribute('required');
    authConfirmPassword.removeAttribute('required');
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = authUsername.value;
    const email = authEmail.value;
    const password = authPassword.value;

    if (!username || !password) {
        alert('Please fill in the required fields.');
        return;
    }

    if (authSubmit.textContent === 'Sign Up') {
        const confirmPassword = authConfirmPassword.value;

        if (!email || !confirmPassword) {
            alert('Please fill in the required fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const userCheckResponse = await fetch(`http://localhost:3000/users?username=${username}&email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (userCheckResponse.ok) {
                const existingUsers = await userCheckResponse.json();

                if (existingUsers.length > 0) {
                    alert('Username or email already exists.');
                    return;
                }

                const userData = { username, email, password }; 
        
                const signupResponse = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData) 
                });
            
                if (signupResponse.ok) {
                    authForm.reset();
                    window.location.href = 'index.html'; 
                } else {
                    console.error('An error occurred while signing up.');
                }
            } else {
                console.error('An error occurred while checking existing users.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        try {
            const userLoginResponse = await fetch('http://localhost:3000/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (userLoginResponse.ok) {
                const foundUsers = await userLoginResponse.json();
        
                console.log('Found Users:', foundUsers); 
        
                const foundUser = foundUsers.find(
                    user => (user.username === username || user.email === username) && user.password === password
                );
        
                if (foundUser) {
                   
                    try {
                        const loginData = { username, password }; 
                        
                        const loginResponse = await fetch('http://localhost:3000/users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(loginData) 
                        });
                    
                        if (loginResponse.ok) {
                            authForm.reset();
                            window.location.href = 'index.html'; 
                        } else {
                            console.error('An error occurred during login.');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                } else {
                    console.error('User not found or incorrect password.');
                }
            } else {
                console.error('An error occurred while logging in.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    
    }
});
