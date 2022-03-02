import React from 'react';
import Login from './login';
import CardState from './cardstate';
import Card from './cardchoice';
import axios from 'axios';
import _ from 'lodash';

class App extends React.Component {
  state = { userName: '', login: false, cardState: [], instance: 'tes', hidden: true};
  constructor(props) {
    super(props);
    this.instance = axios.create({baseURL: 'http://localhost:5000'});
    this.cards = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"]
  }

  componentDidMount() {
    this.interval = setInterval(this.getCardState.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCurrentUsers(userdata) {
    let today = new Date();
    let time = today.getTime();
    let users = _.filter(Object.values(userdata), (user) => {return time-12000 <= user.last_seen});
    return users
  }

  getCardState() {
    if (this.state.login) {
      this.instance.post(`/session/${this.state.instance}`, {user: this.state.userName}).then( res => {
        this.setState({cardState: this.getCurrentUsers(res.data[this.state.instance ].users), hidden: res.data[ this.state.instance ].hidden});
      })
    }
  }

  handleLoginChange(event) {
    this.setState({userName: event.target.value})
  };

  handleRoomChange(event) {
    this.setState({instance: event.target.value})
  };

  handleLoginSubmit(event) {
    event.preventDefault()
    this.instance.post(`/session/${this.state.instance}/logon`, {"user": this.state.userName}).then( res => {
      this.setState({
        cardState: this.getCurrentUsers(res.data[this.state.instance ].users),
        hidden: res.data[ this.state.instance ].hidden,
        login: true});
    })
  };

  handleLogoutSubmit(event) {
    event.preventDefault()
    this.instance.post(`/session/${this.state.instance}/logout`, {"user": this.state.userName}).then( res => {
      this.setState({
        login: false});
    })
  };

  handleChoiceSubmit(event) {
    this.instance.post(`/session/${this.state.instance}/score`, {"user": this.state.userName, "score": event.target.textContent})
      .then( res => {
        this.setState({cardState: this.getCurrentUsers(res.data[this.state.instance ].users), hidden: res.data[ this.state.instance ].hidden});
    })
  }

  handleShowCards(event) {
    this.instance.post(`/session/${this.state.instance}/show`, {"user": this.state.userName, "score": event.target.textContent})
      .then( res => {
        this.setState({cardState: this.getCurrentUsers(res.data[this.state.instance ].users), hidden: res.data[ this.state.instance ].hidden});
    })
  }

  handleReset(event) {
    this.instance.post(`/session/${this.state.instance}/reset`, {"user": this.state.userName, "score": event.target.textContent})
      .then( res => {
        this.setState({cardState: this.getCurrentUsers(res.data[this.state.instance ].users), hidden: res.data[ this.state.instance ].hidden});
    })
  }

  render() {
    let usercards = _.map(this.state.cardState, (user) => { return <div><CardState key={user.username}
                                                                                  username={user.username}
                                                                                  hidden={this.state.hidden}
                                                                                  youruser={this.state.userName}
                                                                                  value={user.score}/></div> })
    let cards = _.map(this.cards, (card) => { return <Card key={card} value={card} handler={this.handleChoiceSubmit.bind(this)} /> } )
    return (
      <div className="ui segment">
        <div className="ui container">
          {!this.state.login ?
            <Login userName={this.state.userName}
                   handleChange={this.handleLoginChange.bind(this)}
                   handleRoomChange={this.handleRoomChange.bind(this)}
                   room={this.state.instance}
                   login={this.handleLoginSubmit.bind(this)}/>
            :
            <div class="ui menu">
              <a class="item"onClick={this.handleShowCards.bind(this)}>
                Show
              </a>
              <a class="item"onClick={this.handleReset.bind(this)}>
                Reset
              </a>
              <div class="right menu" >
                <a class="ui item active">
                  User: {this.state.userName}
                </a>
                <a class="ui item active">
                  Room: {this.state.instance}
                </a>
                <a class="ui item active" onClick={this.handleLogoutSubmit.bind(this)}>
                  Logout
                </a>
              </div>
            </div>}
        <div className="bodygrid">
          <div>
            <div className='cardsgrid'>
              {
                this.state.login ?
                  cards
                  :
                  null
              }
            </div>
          </div>
          <div className='votesgrid'>
          {
            this.state.login ?
              usercards
              :
              null
          }
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default App;