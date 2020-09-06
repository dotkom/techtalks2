import React, { useState, useEffect } from 'react';

import { get } from '../../../utils/apiCalls.js';
import Company from './Company';

const Companies = (props) => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const internal = async () => {
      await get('/admin/companies')
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((bedrifter) => setCompanies(bedrifter));
    };
    internal();
  }, []);

  const updateCompany = (indexToUpdate, newValue) => {
    const copy = [...companies];
    copy[indexToUpdate] = newValue;
    setCompanies(copy);
  };

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
