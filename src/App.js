import React, { Component } from 'react';
import LoginForm from 'login/LoginForm';
import AuthContent from 'auth-content/AuthContent';
import BgBubbles from 'bg-bubbles/BgBubbles';
import 'css/App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            authInfo: {}
        };
    }

    loginFinished(authInfo) {
        if (authInfo) {
            setTimeout(function() {
                this.setState({
                    authenticated: true,
                    authInfo: authInfo
                });
            }.bind(this), 250);
        }
    }

    logout() {
        this.setState({
            authenticated: false,
            authInfo: {}
        });
    }

    render() {
        var loginForm = this.state.authenticated ? null : <LoginForm loginFinished={this.loginFinished.bind(this)}/>;
        var authContent = this.state.authenticated ? <AuthContent authInfo={this.state.authInfo} logout={this.logout.bind(this)}/> : null;
        return (
            <div className="wrapper">
                {loginForm}
                {authContent}
                <BgBubbles />
            </div>
        );
    }
}

export default App;
