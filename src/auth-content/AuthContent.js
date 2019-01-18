import React, { Component } from 'react';
import { configuration } from 'config.js';
import 'css/auth-content.css';

class AuthContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buckets: [],
            dataApiUrl: configuration.dataApiUrl
        }
    }

    loadData(event) {
        event.preventDefault();
        var idToken = this.props.authInfo.IdToken;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.state.dataApiUrl + '/data');
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.setRequestHeader('Authorization', idToken);
        xhr.onload = function() {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            if (xhr.status === 200) {
                this.setState({
                    buckets: response.buckets
                });
            } else {
                console.log("Failure!");
            }
        }.bind(this);
        xhr.send();
    }

    logout() {
        this.props.logout();
    }

    render() {
        const bucketList = this.state.buckets.map((item, index) => <p key={index}>{item}</p>);
        return (
            <div className='container'>
                <h1>You are authenticated!</h1>
                <div className='content'>
                    <button id="load-data" onClick={this.loadData.bind(this)}>Make API Call</button>
                    <br />
                    <button id="logout-button" onClick={this.logout.bind(this)}>Logout</button>
                    <div>
                        {bucketList}
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthContent;
