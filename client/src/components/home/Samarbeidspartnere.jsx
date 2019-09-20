import React, { Component } from 'react';
import styled from 'styled-components';

class Samarbeidspartnere extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partners: props.partners,
    };
  }

  render() {
    const Wrapper = styled.div`
      margin: auto;
      width: 100%;
      max-width: 600px;
    `;
    const { partners } = this.state;
    const pages = [];
    // pages inneholder partnere, i grupper på 3
    const n = partners.length;
    for (let i = 0; i < n; i += 3) {
      const page = [];
      for (let j = i; j < i + 3 && j < n; j++) {
        page.push(partners[j]);
      }
      pages.push(page);
    }
    return (
      <Wrapper>
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
  }
}

export default Samarbeidspartnere;
