import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div className="search-bar">
        <form onSubmit={this.props.login} className="ui form">
          <div className="field">
            <label>Username</label>
            <input type="text" value={this.props.userName} onChange={this.props.handleChange}/>
            <label>Room</label>
            <input type="text" value={this.props.room} onChange={this.props.handleRoomChange}/>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    )
  }
}

export default Login;