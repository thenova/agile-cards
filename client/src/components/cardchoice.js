import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
        <div className="cardicon" value={ this.props.value } onClick={this.props.handler}>
            {this.props.value}
        </div>
    )
  }
}

export default Card;