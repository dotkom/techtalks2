import React, { Component } from 'react';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
    }
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <h1>Info om arrangement</h1>
      </div>
    );
  }
};

export default Event;
