import React, { Component } from 'react';
import { configuration } from 'config.js';
import 'css/login.css';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginApiUrl: configuration.loginApiUrl,
            signup: false,
            signingUp: false,
            loggingIn: false,
            authenticated: false,
            confirming: false,
            confirmUser: "",
            message: ""
        };
    }

    startSignup(event) {
        event.preventDefault();
        this.setState({
            signup: true
        });
    }

    stopSignup(event) {
        event.preventDefault();
        this.setState({
            signup: false
        });
    }

    submitSignup(event) {
        event.preventDefault();
        var username = document.getElementById('user').value;
        var password = document.getElementById('pass').value;
        var email = document.getElementById('email').value;

        this.setState({
            signingUp : true
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.state.loginApiUrl + '/signup');
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                document.getElementById('user').value = "";
                document.getElementById('pass').value = "";
                document.getElementById('email').value = "";
                this.setState({
                    signup: false,
                    signingUp: false,
                    confirming: false,
                    confirmUser: username,
                    message: 'A confirmation code has been sent to your email address.'
                });
            } else {
                this.setState({
                    signingUp: false,
                    message: response.message
                });
            }
        }.bind(this);

        xhr.send(JSON.stringify({
            username: username,
            password: password,
            email: email
        }));
    }

    confirmUser(event) {
        event.preventDefault();
        var username = this.state.confirmUser;
        var confirmationCode = document.getElementById('confirm-input').value;

        this.setState({
            confirming: true
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.state.loginApiUrl + '/confirm');
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                document.getElementById('confirm-input').value = "";
                this.setState({
                    confirming: false,
                    confirmUser: "",
                    message: 'Successfully confirmed email!'
                });
            } else {
                this.setState({
                    message: response.message
                });
            }
        }.bind(this);

        xhr.send(JSON.stringify({
            username: username,
            confirmationCode: confirmationCode
        }));
    }

    submitLogin(event) {
        event.preventDefault();
        this.setState({
            loggingIn : true
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', this.state.loginApiUrl + '/login');
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                document.getElementById('user').value = "";
                document.getElementById('pass').value = "";
                this.setState({
                    authenticated: true,
                    loggingIn: false
                });
                this.props.loginFinished(response.AuthenticationResult);
            } else {
                this.setState({
                    loggingIn: false,
                    message: response.message
                });
            }
        }.bind(this);

        xhr.send(JSON.stringify({
            username: document.getElementById('user').value,
            password: document.getElementById('pass').value
        }));
    }

    render() {
        var formElementClass = '';
        var containerElementClass = 'container';
        var header = 'Login Page';
        var formElement = null;

        if (this.state.signup) {
            if (this.state.signingUp) {
                formElementClass = 'form-hidden';
                containerElementClass = 'container form-processing';
                header = 'Registering user...'
            } else {
                header = 'Register user';
            }

            formElement =
                <form className={formElementClass}>
                    <p>{this.state.message}</p>
                    <input id="user" type="text" placeholder="Username" />
                    <input id="pass" type="password" placeholder="Password" />
                    <input id="email" type="email" placeholder="Email" />
                    <button id="signup-button" onClick={this.submitSignup.bind(this)}>Signup</button>
                    <br/>
                    <button id="stop-signup-button" onClick={this.stopSignup.bind(this)}>Back</button>
                </form>;
        } else if (this.state.confirmUser !== "") {
            if (this.state.confirming) {
                formElementClass = 'form-hidden';
                containerElementClass = 'container form-processing';
                header = 'Verifying confirmation code...'
            } else {
                header = 'Enter confirmation code'
            }

            formElement =
                <form className={formElementClass}>
                    <p>{this.state.message}</p>
                    <input id="confirm-input" type="text" placeholder="Confirmation code" />
                    <button id="confirm-button" onClick={this.confirmUser.bind(this)}>Confirm</button>
                </form>;
        } else {
            if (this.state.loggingIn) {
                formElementClass = 'form-hidden';
                containerElementClass = 'container form-processing';
                header = 'Logging in...'
            } else if (this.state.authenticated) {
                formElementClass = 'form-hidden';
                containerElementClass = 'container form-complete';
                header = 'Welcome!'
            }

            formElement =
                <form className={formElementClass}>
                    <p>{this.state.message}</p>
                    <input id="user" type="text" placeholder="Username" />
                    <input id="pass" type="password" placeholder="Password" />
                    <button id="login-button" onClick={this.submitLogin.bind(this)}>Login</button>
                    <br/>
                    <button id="start-signup-button" onClick={this.startSignup.bind(this)}>Register</button>
                </form>;
        }

        return (
            <div className={containerElementClass}>
                <h1 id="header">{header}</h1>
                {formElement}
            </div>
        );
    }
}

export default LoginForm;
