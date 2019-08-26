import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import InputField from '../inputs/InputField';

class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      status: 'waiting',
    };
    this.changeUsername = this.changeUsername.bind(this);
    this.changePass = this.changePass.bind(this);
    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      const req = {
        method: 'POST',
        body: JSON.stringify({
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = await fetch('/db/isAdminLoggedIn', req);
      const j = await res.json();
      const { loggedIn } = j;
      if (loggedIn === 'y') {
        this.setState({
          status: 'succeeded',
        });
      }
    }
  }

  changeUsername(newVal) {
    this.setState({
      username: newVal,
    });
  }

  changePass(newVal) {
    this.setState({
      password: newVal,
    });
  }

  async login() {
    const { username, password } = this.state;
    console.log(`Attempted login with username ${username} and password ${password}`);
    const req = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    console.log(req);
    const res = await fetch('/db/adminLogin', req);
    const j = await res.json();
    const { token, status } = j;
    if (status === 'succeeded') {
      localStorage.setItem('token', token);
    }
    this.setState({
      status,
    });
    console.log(j);
  }

  render() {
    const { username, password, status } = this.state;
    if (status === 'succeeded') {
      return <Redirect to="/admin/main" />;
    }
    return (
      <div>
        <h1>Sup, wanna login?</h1>
        <InputField
          updateValue={this.changeUsername}
          label="Brukernavn: "
          id="adminUsername"
          val={username}
          type="text"
        />
        <InputField updateValue={this.changePass} label="Passord: " id="adminPass" val={password} type="password" />
        {status === 'invalid' ? <p>Invalid login credentials</p> : null}
        <button type="button" onClick={this.login}>
          Attempt hack
        </button>
      </div>
    );
  }
}

export default AdminLogin;
