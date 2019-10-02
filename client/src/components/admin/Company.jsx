import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import InputField from '../inputs/InputField';

class Company extends Component {
  constructor(props) {
    super(props);
    const { bedriftID, navn, logo, sponsorType } = props;
    this.state = {
      status: 'default',
      bedriftID,
      navn,
      logo,
      sponsorType,
      edit: false,
      preedit: {
        navn,
        logo,
        sponsorType,
      },
    };
  }

  allowEditing = () => {
    this.setState({
      edit: true,
    });
  }

  cancelEditing = () => {
    const { preedit } = this.state;
    const { navn, logo, sponsorType } = preedit;
    this.setState({
      navn,
      logo,
      sponsorType,
      edit: false,
    });
  }

  submitEdit = async () => {
    const token = localStorage.getItem('token');
    const { bedriftID, navn, logo, sponsorType, preedit } = this.state;
    const oldSponsorType = preedit.sponsorType;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        bedriftID,
        navn,
        logo,
        oldSponsorType,
        sponsorType,
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
          sponsorType,
        },
      });
    }
  }

  changeName  = navn => {
    this.setState({
      navn,
    });
  }

  changeLogo = logo => {
    this.setState({
      logo,
    });
  }

  changeSponsorship = e => {
    this.setState({
      sponsorType: parseInt(e.target.value),
    });
  }

  render() {
    const { status, navn, logo, sponsorType, edit, bedriftID } = this.state;
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
              <select value={sponsorType} onChange={this.changeSponsorship}>
                <option value={0}>Nei</option>
                <option value={1}>Sølv</option>
                <option value={2}>Gull</option>
                <option value={3}>HSP</option>
              </select>
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

    let sponsorName = null;
    if(sponsorType === 1) {
      sponsorName = 'Sølv';
    } else if (sponsorType === 2) {
      sponsorName = 'Gull';
    } else if (sponsorType === 3) {
      sponsorName = 'HSP';
    } else {
      sponsorName = 'Nei';
    }

    return (
      <tr>
        <td>{navn}</td>
        <td>{logo}</td>
        <td>{sponsorName}</td>
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
