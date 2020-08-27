import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { post } from '../../../utils/apiCalls.js';
import Company from './Company';

const Companies = (props) => {
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    const internal = async () => {
      const token = localStorage.getItem('token');
      const req = {
        body: JSON.stringify({
          token,
        }),
      };
      const res = await post('/db/allCompanies', req);
      const j = await res.json();
      console.log(j);
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
        <a href="/admin/newCompany">Legg til nytt selskap</a>
        <br />
        <a href="/admin/importCompany">Importer selskap fra OW</a>
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
          {companies.map(({ BedriftID, Navn, Logo, sponsorType, local }, index) => (
            <Company
              key={BedriftID}
              bedriftID={BedriftID}
              navn={Navn}
              logo={Logo}
              local={local}
              sponsorType={sponsorType}
              handleUpdate={(values) => updateCompany(index, values)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Companies;
