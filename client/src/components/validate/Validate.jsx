import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div``;

class Validate extends Component {
  constructor(props) {
    super(props);
    const u = new URL(window.location.href);
    const ha = u.searchParams.get('ha');
    this.state = {
      status: 'waiting',
      ha,
    };
  }

  async componentDidMount() {
    const { ha } = this.state;
    const req = {
      method: 'POST',
      body: JSON.stringify({
        hash: ha,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('db/validering', req);
    const jsoned = await res.json();
    const { status } = jsoned;
    this.setState({
      status,
    });
  }

  render() {
    const { status } = this.state;
    if (status === 'succeeded') {
      return (
        <Wrapper>
          <h2>Påmeldingen din har blitt validert!</h2>
        </Wrapper>
      );
    }
    if (status === 'repeat') {
      return (
        <Wrapper>
          <h2>Påmeldingen din har allerede blitt validert</h2>
        </Wrapper>
      );
    }
    if (status === 'failed') {
      return (
        <Wrapper>
          <h2>Kunne ikke validere påmeldingen din</h2>
        </Wrapper>
      );
    }
    return (
      <Wrapper>
        <h2>Validerer påmelding</h2>
      </Wrapper>
    );
  }
}

export default Validate;
