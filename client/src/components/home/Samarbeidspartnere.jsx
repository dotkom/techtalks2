import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BigImg = styled.img`
  max-height: 20em;
  max-width: 50%;
`;

const Partners = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: auto;
  justify-content: space-around;
`;

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
      <Partners>
        {gullSølvSponsor.map(({ name, url}) => (
          <Img
            src={`https://online.ntnu.no/media/images/responsive/${url}`}
            alt={name}
            key={url} 
          />
        ))}
      </Partners>
    </Wrapper>
  );
};

export default Samarbeidspartnere;
