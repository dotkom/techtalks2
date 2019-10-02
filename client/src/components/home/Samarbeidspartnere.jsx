import React from 'react';
import styled from 'styled-components';

const Samarbeidspartnere = props => {
  const Wrapper = styled.div`
    margin: auto;
    width: 100%;
    max-width: 600px;
  `;
  const { partners } = props;
  const [ hovedSamarbeidspartner ] = partners.filter(partner => partner.sponsorType === 3);
  const gullSponsor = partners.filter(partner => partner.sponsorType === 2);
  const sølvSponsor = partners.filter(partner => partner.sponsorType === 1);
  // siden skiller for tiden ikke mellom gull- og sølvsponsorer
  const gullSølvSponsor = gullSponsor.concat(sølvSponsor);
  const pages = [];
  // pages inneholder partnere, i grupper på 3
  const n = gullSølvSponsor.length;
  for (let i = 0; i < n; i += 3) {
    const page = [];
    for (let j = i; j < i + 3 && j < n; j++) {
      page.push(gullSølvSponsor[j]);
    }
    pages.push(page);
  }
  return (
    <Wrapper>
      { hovedSamarbeidspartner ? (
        <div>
          <h2>Hovedsamarbeidspartner</h2>
          {
            <img src={hovedSamarbeidspartner.url} alt={hovedSamarbeidspartner.name} />
          }
        </div>
      ) : null}
      
      <h2>Samarbeidspartnere</h2>
      {pages.map((page, pageno) => {
        return (
          <div key={pageno}>
            {page.map((partner, partnerno) => {
              const BetterImg = styled.img`
                max-height: 200px;
                max-width: 200px;
              `;
              const { name, url } = partner;
              return <BetterImg src={url} alt={name} key={partnerno} />;
            })}
            <br />
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Samarbeidspartnere;
