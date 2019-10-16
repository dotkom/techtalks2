import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
`;

const BigImg = styled.img`
  max-height: 20em;
  max-width: 50%;
`

const Img = styled.img`
  max-height: 15em;
  max-width: 30%;
`;

const Samarbeidspartnere = props => {
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
            <BigImg 
              src={`https://online.ntnu.no/media/images/responsive/${hovedSamarbeidspartner.url}`}
              alt={hovedSamarbeidspartner.name} 
            />
          }
        </div>
      ) : null}
      
      <h2>Samarbeidspartnere</h2>
      {pages.map((page, pageno) => {
        return (
          <div key={pageno}>
            {page.map(({ name, url }, partnerno) => 
              <Img 
                src={`https://online.ntnu.no/media/images/responsive/${url}`}
                alt={name}
                key={partnerno} 
              />
            )}
            <br />
          </div>
        );
      })}
    </Wrapper>
  );
};

export default Samarbeidspartnere;
