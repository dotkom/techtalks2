import React, { Component } from 'react';
import styled from 'styled-components';

import InputField from '../inputs/InputField.jsx';

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: auto;
  text-align: left;
`;

class Paamelding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navn: '',
      epost: '',
      linjeforening: '',
      alder: '',
      studieår: '',
      event: props.event,
      status: '',
    };
    this.updateName = this.updateName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateLinje = this.updateLinje.bind(this);
    this.updateAge = this.updateAge.bind(this);
    this.updateYear = this.updateYear.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateName(newVal) {
    this.setState({
      navn: newVal,
    });
  }

  updateEmail(newVal) {
    this.setState({
      epost: newVal,
    });
  }

  updateLinje(newVal) {
    this.setState({
      linjeforening: newVal,
    });
  }

  updateAge(newVal) {
    this.setState({
      alder: newVal,
    });
  }

  updateYear(newVal) {
    this.setState({
      studieår: newVal,
    });
  }

  async submitForm() {
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
    const { navn, epost, linjeforening, alder, studieår, event, status } = this.state;
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
      </Wrapper>
    );
  }
}

export default Paamelding;
