import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../inputs/InputField';

class NewCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      logo: '',
      isSponsor: false,
      status: 'default',
    };
    this.changeName = this.changeName.bind(this);
    this.changeLogo = this.changeLogo.bind(this);
    this.changeSponsorship = this.changeSponsorship.bind(this);
    this.submitCompany = this.submitCompany.bind(this);
  }

  changeName(name) {
    this.setState({
      name,
    });
  }

  changeLogo(logo) {
    this.setState({
      logo,
    });
  }

  changeSponsorship(e) {
    this.setState({
      isSponsor: e.target.checked,
    });
  }

  async submitCompany() {
    const token = localStorage.getItem('token');
    const { name, logo, isSponsor } = this.state;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        navn: name,
        logo,
        isSponsor,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.setState({
      status: 'waiting',
    });
    const res = await fetch('/db/newCompany', req);
    const j = await res.json();
    const { status } = j;
    this.setState({
      status,
    });
  }

  render() {
    const { name, logo, isSponsor, status } = this.state;
    if (status === 'denied') {
      return <Redirect to="/admin" />;
    }

    if (status === 'succeeded') {
      return <Redirect to="/admin/companies" />;
    }
    return (
      <div>
        <InputField label="Navn: " id="cName" val={name} updateValue={this.changeName} type="text" />
        <InputField label="Logo: " id="cLogo" val={logo} updateValue={this.changeLogo} type="text" />
        <label htmlFor="cSpons">
          Sponsor
          <input type="checkbox" id="cSpons" checked={isSponsor} onChange={this.changeSponsorship} />
        </label>
        <button type="button" onClick={this.submitCompany}>
          Lag selskap
        </button>
        {status === 'failed' ? <p>Kunne ikke opprette selskapet</p> : null}
      </div>
    );
  }
}

export default NewCompany;
