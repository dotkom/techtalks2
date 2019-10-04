import React, { Component } from 'react';
import styled from 'styled-components';

import InputField from '../inputs/InputField';

const Wrapper = styled.div`
  width: 100%;
  margin: 0;
  text-align: left;
`;

class Paamelding extends Component {
  state = {
    navn: '',
    epost: '',
    linjeforening: '',
    alder: '',
    studieår: '',
    status: '',
  };

  updateName = navn => {
    this.setState({
      navn,
    });
  }

  updateEmail = epost => {
    this.setState({
      epost,
    });
  }

  updateLinje = linjeforening => {
    this.setState({
      linjeforening,
    });
  }

  updateAge = alder => {
    this.setState({
      alder,
    });
  }

  updateYear = studieår => {
    this.setState({
      studieår,
    });
  }

  submitForm = async () => {
    const { navn, epost, linjeforening, alder, studieår } = this.state;
    console.log(`navn: ${navn}`);
    console.log(`linje: ${linjeforening}`);
    console.log(`alder: ${alder}`);
    console.log(`studieår: ${studieår}`);
    const req = {
      method: 'POST',
      body: JSON.stringify({
        navn,
        epost,
        linjeforening,
        alder,
        studieår,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('db/paamelding', req);
    const jsoned = await res.json();
    console.log(jsoned);
    this.setState({
      status: jsoned.status,
    });
  }

  render() {
    const { navn, epost, linjeforening, alder, studieår, status } = this.state;
    const { event } = this.props;
    const { AntallPlasser, AntallPåmeldte } = event;
    if (status === 'succeeded') {
      return (
        <Wrapper>
          <h2 id="paamelding">Påmelding</h2>
          <p>
            Du vil snart få en bekreftelses e-post sendt til {epost}.
            <br />
            <b>OBS! Du er ikke påmeldt før du har verifisert påmeldingen din</b>
          </p>
        </Wrapper>
      );
    }
    return (
      <Wrapper>
        <h2 id="paamelding">Påmelding</h2>
        <h3>{`${AntallPåmeldte} av ${AntallPlasser} påmeldt`}</h3>
        { 
          AntallPåmeldte < AntallPlasser ? (
            <div>
              <InputField type="text" updateValue={this.updateName} label="Navn: " id="paameldingNavn" val={navn} />
              <InputField type="text" updateValue={this.updateEmail} label="E-post: " id="paameldingEpost" val={epost} />
              <InputField
                type="text"
                updateValue={this.updateLinje}
                label="Linjeforening: "
                id="paameldingLinje"
                val={linjeforening}
              />
              <InputField type="number" updateValue={this.updateAge} label="Alder: " id="paameldingAlder" val={alder} />
              <InputField
                type="number"
                updateValue={this.updateYear}
                label="Studieår: "
                id="paameldingStudieaar"
                val={studieår}
              />
              <button onClick={this.submitForm}>Meld meg på</button>
            </div>
          )  : <p>Arrangementet er fullt</p>
        }
        
      </Wrapper>
    );
  }
}

export default Paamelding;
