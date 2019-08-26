import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../inputs/InputField';

class Company extends Component {
  constructor(props) {
    super(props);
    const { bedriftID, navn, logo, isSponsor } = props;
    this.state = {
      status: 'default',
      bedriftID,
      navn,
      logo,
      isSponsor,
      edit: false,
      preedit: {
        navn,
        logo,
        isSponsor,
      },
    };
    this.allowEditing = this.allowEditing.bind(this);
    this.cancelEditing = this.cancelEditing.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeLogo = this.changeLogo.bind(this);
    this.changeSponsorship = this.changeSponsorship.bind(this);
  }

  allowEditing() {
    this.setState({
      edit: true,
    });
  }

  cancelEditing() {
    const { preedit } = this.state;
    const { navn, logo, isSponsor } = preedit;
    this.setState({
      navn,
      logo,
      isSponsor,
      edit: false,
    });
  }

  async submitEdit() {
    const token = localStorage.getItem('token');
    const { bedriftID, navn, logo, isSponsor, preedit } = this.state;
    const wasSponsor = preedit.isSponsor;
    const sponsorshipChanged = wasSponsor !== isSponsor;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        BedriftID: bedriftID,
        Navn: navn,
        Logo: logo,
        sponsorshipChanged,
        isSponsor,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('/db/editCompany', req);
    const j = await res.json();
    const { status } = j;
    if (status === 'denied' || status === 'failed') {
      this.setState({
        status,
      });
    } else {
      this.setState({
        status,
        edit: false,
        preedit: {
          navn,
          logo,
          isSponsor,
        },
      });
    }
  }

  changeName(navn) {
    this.setState({
      navn,
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

  render() {
    const { status, navn, logo, isSponsor, edit, bedriftID } = this.state;
    if (status === 'denied') {
      return <Redirect to="/admin" />;
    }
    if (edit) {
      return (
        <tr>
          <td colSpan="4">
            <InputField
              label="Navn: "
              id={`company${bedriftID}Name`}
              updateValue={this.changeName}
              val={navn}
              type="text"
            />
            <InputField
              label="Logo: "
              id={`company${bedriftID}Logo`}
              updateValue={this.changeLogo}
              val={logo}
              type="text"
            />
            <label htmlFor={`company${bedriftID}Spons`}>
              Sponsor?
              <input
                type="checkbox"
                checked={isSponsor}
                onChange={this.changeSponsorship}
                id={`company${bedriftID}Spons`}
              />
            </label>
            <button type="button" onClick={this.submitEdit}>
              Submit
            </button>
            <button type="button" onClick={this.cancelEditing}>
              Avbryt
            </button>
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td>{navn}</td>
        <td>{logo}</td>
        <td>{isSponsor ? 'Ja' : 'Nei'}</td>
        <td>
          <button type="button" onClick={this.allowEditing}>
            Endre
          </button>
        </td>
      </tr>
    );
  }
}

export default Company;
