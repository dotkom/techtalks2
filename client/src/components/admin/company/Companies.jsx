import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Company from './Company';

const Companies = props => {
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState('waiting');

  useEffect(()=> {
    const internal = async () => {
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
      const { status, bedrifter } = j;
      setStatus(status);
      setCompanies(bedrifter);
    };
    internal();
  }, []);

  const updateCompany = (indexToUpdate, newValue) => {
    const copy = [...companies];
    copy[indexToUpdate] = newValue;
    setCompanies(copy);
  };

  if (status === 'denied') {
    return <Redirect to="/admin" />;
  }

  return (
    <div>
      <h1>Alle selskaper</h1>
      <p>
        <a href="/admin/importCompany">Legg til nytt selskap</a>
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
          {companies.map(({ BedriftID, Navn, Logo, sponsorType }, index) => (
            <Company
              key={BedriftID}
              bedriftID={BedriftID}
              navn={Navn}
              logo={Logo}
              sponsorType={sponsorType}
              handleUpdate={values=>updateCompany(index, values)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Companies;
