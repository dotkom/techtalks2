import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Company from './Company';

class Companies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
      status: 'waiting',
    };
  }

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('/db/allCompanies', req);
    const j = await res.json();
    console.log(j);
    const { status, bedrifter } = j;
    this.setState({
      status,
      companies: bedrifter,
      creating: false,
    });
  }

  render() {
    const { companies, status } = this.state;
    if (status === 'denied') {
      return <Redirect to="/admin" />;
    }
    return (
      <div>
        <h1>Alle selskaper</h1>
        <p>
          <a href="/admin/newCompany">Legg til nytt selskap</a>
        </p>
        <table>
          <thead>
            <tr>
              <th>Selskap</th>
              <th>Logo</th>
              <th>Sponsor?</th>
              <th>Endre</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(({ BedriftID, Navn, Logo, isSponsor }) => (
              <Company key={BedriftID} bedriftID={BedriftID} navn={Navn} logo={Logo} sponsorType={sponsorType} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Companies;
