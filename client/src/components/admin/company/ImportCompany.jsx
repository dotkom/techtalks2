import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';

import InputField from '../../inputs/InputField.jsx';

const Img = styled.img`
  max-width: 10em;
`;

class ImportCompany extends Component {
  state = {
    status: 'waiting',
    name: '',
    companies: []
  }

  searchDotkom = async () => {
    const { name } = this.state;
    const res = await fetch(`https://online.ntnu.no/api/v1/companies?name=${name}`);
    const j = await res.json();
    const { results } = j;
    this.setState({
      status: 'loaded',
      companies: results
    });
    console.log(results);
  }

  addCompany = async index => {
    const { companies } = this.state;
    const company = companies[index];
    const { name, image } = company;
    const { original } = image;
    const parts = original.split('/');
    const imageID = parts[parts.length - 1];
    console.log(name);
    console.log(imageID);
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        token,
        navn: name,
        logo: imageID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await fetch('/db/newCompany', req);
    const j = await res.json();
    if(j.status === 'succeeded') {
      this.setState({
        status: 'succeeeded'
      });
    }
  }

  updateName = async name => {
    this.setState({name});
  }

  render() {
    const { status, companies, name } = this.state;
    if (status === 'succeeeded') {
      return <Redirect to="/admin/companies" />;
    }
    return (
      <div>
        <h1>Importer et selsap fra dotkom's API</h1>
        <InputField
          label="Navn (case sensitive): "
          id="nameIn"
          val={name}
          type="text"
          updateValue={this.updateName}
        />
        <button type="button" onClick={this.searchDotkom}>Søk</button>
        {
          status === 'loaded' ? (
            <table>
              <thead>
                <tr>
                  <th>Navn</th><th>Bilde</th><th>Legg til</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company, index) => (
                  <tr key={index}>
                    <td>{company.name}</td>
                    <td><Img src={`https://online.ntnu.no${company.image.original}`} /></td>
                    <td><button onClick={() => this.addCompany(index)}>Legg til</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null
        }
      </div>
    );
  }
}

export default ImportCompany;
