import React from 'react';
import _ from 'lodash';

class CardState extends React.Component {
  render () {
    let choice= this.props.value
    let color = 'ui card teal'
    let bgicon = 'card image icon teal'
    if (this.props.username !== this.props.youruser) {
      if (this.props.hidden === true && !_.isNull(this.props.value) ) {
        choice = 'X'
        color = 'ui card green'
        bgicon = 'card image icon green'
      } else if (this.props.hidden === true && _.isNull(this.props.value)) {
        choice = ''
        color = 'ui card red'
        bgicon = 'card image icon red'
      }
    }


    return (
      <div className={color}>
        <div className={bgicon}>
            {choice}
        </div>
        <div className="content">
          <div className="header center">
            {this.props.username}
          </div>
        </div>
      </div>
    )
  }
}

export default CardState;