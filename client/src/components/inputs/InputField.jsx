import React, { Component } from 'react';

class InputField extends Component {
	constructor(props) {
    super(props);
    const { updateValue, label, id, val, type, disabled } = props;
    this.updateValue = updateValue;
		this.state = {
      label,
      id,
      val,
      type,
      disabled
    };
    this.handleChange = this.handleChange.bind(this);
  }
  

  handleChange(e) {
    const val = e.target.value;
    this.setState({
      val
    });
    this.updateValue(val);
  }

	render() {
    const { label, id, val, type, disabled } = this.state;
    if (type === 'textarea') {
      return (
        <div>
          <label htmlFor={id}>
            <span>{label}</span>
            <textarea key={id} onChange={this.handleChange} id={id} value={val} disabled={disabled} />
          </label>
			</div>
      );
    }
		return (
			<div>
        <label htmlFor={id}>
          <span>{label}</span>
          <input key={id} type={type} onChange={this.handleChange} id={id} value={val} disabled={disabled} />
        </label>
			</div>
		);
	}
}

export default InputField;
