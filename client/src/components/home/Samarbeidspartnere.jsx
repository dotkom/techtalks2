import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BigImg = styled.img`
  max-height: 20em;
  max-width: 50%;
  margin: 0.5em;
  padding: 1em;
  filter: brightness(0) invert(1);
  image-rendering: smooth;
`;

const Partners = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: auto;
  justify-content: space-around;
`;

const Img = styled.img`
  margin: 0.5em 0.2em;
  padding: 0.2em;
  filter: brightness(0) invert(1);
  image-rendering: smooth;

  display: inline-block;
  width: 100%;
  height: auto;
`;

const ImgSizeGuardian = styled.div`
  max-width: 30%;
  max-height: 15em;
`;

const Samarbeidspartnere = props => {
  const { partners } = props;
  if(partners.length === 0) {
    return (
      <Wrapper>
        <h2>Samarbeidspartnere</h2>
        <h3>Kommer snart</h3>
      </Wrapper>
    );
  }
  const [ HSP ] = partners.filter(partner => partner.sponsorType === 3);
  const gullSponsor = partners.filter(partner => partner.sponsorType === 2);
  const sølvSponsor = partners.filter(partner => partner.sponsorType === 1);
  return (
    <Wrapper>
      { HSP ? (
        <div>
          <h2>Hovedsamarbeidspartner</h2>
          {
            <BigImg 
              src={HSP.local ? `/img/${HSP.url}` : `https://online.ntnu.no/media/images/responsive/${HSP.url}`}
              alt={HSP.name} 
            />
          }
        </div>
      ) : null}
      { gullSponsor.length > 0 ? (
        <div>
          <h2>Samarbeidspartnere</h2>
          <Partners>
            {gullSponsor.map(({ name, url, local }) => (
              <ImgSizeGuardian>
                <Img
                  src={local ? `/img/${url}` : `https://online.ntnu.no/media/images/responsive/${url}`}
                  alt={name}
                  key={url} 
                />
              </ImgSizeGuardian>
            ))}
          </Partners>
        </div>
      ) : null}
      { sølvSponsor.length > 0 ? (
        <div>
          <h2>Sponsorer</h2>
          <Partners>
            {
              sølvSponsor.map(({ name, url, local }) => (
                <ImgSizeGuardian>
                  <Img
                    src={local ? `/img/${url}` : `https://online.ntnu.no/media/images/responsive/${url}`}
                    alt={name}
                    key={url}
                  />
                </ImgSizeGuardian>
              ))
            }
          </Partners>
        </div>
      ) : null}
    </Wrapper>
  );
};

export default Samarbeidspartnere;
