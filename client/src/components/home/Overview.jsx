import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
`;

const PartContainer = styled.div`
  :not(:first-child) {
    /*border-left: 1px solid #333333; */
  }
  flex: 1;
  flex-basis: 0;
  flex-grow: 1;
  padding: 2em;
  min-height: 20em;
`

const InnerContainer = styled.div`
margin: auto;
`;

function ProgramElement(title, place, time, needsRegistration) {
  return (<PartContainer key={title}>
              <InnerContainer>
                <h2>{title}</h2>
                <p>{place}</p>
                <p>{time}</p>
                <p>{ needsRegistration ? (needsRegistration === 2 ? (<b>Krver egen påmelding</b>) : (<b>Krver påmelding</b>)) : (<b>Åpent for alle</b>)}</p>
                </InnerContainer>
              </PartContainer>);
}

const Overview = props => {
  const { events } = props;

  const fullEvents = events.filter(event => {
    return event.alleParalleller === 1;
  });

  console.log(fullEvents);
  
  return (
    <Wrapper>
      {
        fullEvents.length ? (
          fullEvents.map(event =>{
            return ProgramElement(event.navn, event.stedNavn, event.tid, event.navn.toLowerCase().indexOf("frokost") !== -1 ? 2 : 1);
          })
        ) : (
          <h3>Laster...</h3>
        )
      }
      {
        ProgramElement("Foredrag og workshops", "Realfagbygget og IT-bygget", "10:00 til 16:00", false)
      }
      {
        ProgramElement("Middag", "Scandic Nidelven", "19:00", true)
      }
    </Wrapper>
  );
}

export default Overview;
