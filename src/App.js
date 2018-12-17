import React, { Component } from 'react';
import './App.css';

import Stepper from 'react-stepper-horizontal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readMore: false,
      activeStep: 0,
      accountSID: '',
      authToken: '',
      fromPhone: '',
      credValid: false,
      loading: false,
      ownPhone: '',
      comrades: [],
    };

    this.step = this.step.bind(this);
    this.toggleReadMore = this.toggleReadMore.bind(this);
    this.haveCred = this.haveCred.bind(this);
    this.validate = this.validate.bind(this);
  }

  step(isStepBack) {
    var { activeStep } = this.state;
    activeStep += (isStepBack ? -1 : 1);
    this.setState({
      activeStep
    });
  }

  toggleReadMore() {
    this.setState({ readMore: !this.state.readMore });
  }

  haveCred() {
    var { accountSID, authToken, fromPhone } = this.state;
    return accountSID !== '' && authToken !== '' && fromPhone !== '';
  }

  validate() {
    if (!this.haveCred() || this.credValid) return;
    this.setState({ loading: true });

    // var { accountSID, authToken, fromPhone } = this.state;
    var { accountSID, authToken } = this.state;
    var basic = accountSID + ':' + authToken;

    window.fetch("https://messaging.twilio.com/v1/Services", {
      headers: {
        Authorization: "Basic " + btoa(basic)
      }
    }).then(body => body.json()).then(resp => {
      this.setState({
        loading: false,
        credValid: !resp.code
      });
    }).catch(e => {
      this.setState({ loading: false });
      console.error(e);
    });
  }

  sendTest() {
    // todo write a sender api method and call it here

  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12">
            <h1>
              Txtr
              <span style={ { fontSize: '.4em', color: '#ccc' } }>
                Sending Txts to everyone around
              </span>
            </h1>
            <h3>How to use it</h3>
            <p>
              First, get a Twilio Acct. Get three pieces of information from
              there: SID, Token, and the phone number you bought there for a
              dollar. Type those in at step 1.
            </p>

            <p className={ this.state.readMore ? "" : "collapse"}>
              Proceed to step two, where you can enter a delimiter separated
              list of phone numbers (format <code>+1XXXYYYZZZZ</code> of
              course). See a preview of the recognized numbers on this screen
              as well.
            </p>
            <p className={ this.state.readMore ? "" : "collapse"}>
              Next proceed to step three, and hit send, noting send successes
              (and failures).
            </p>
            <p className={ this.state.readMore ? "" : "collapse"}>
              On step four, share in the fruits of organizing for the
              collective liberation of the working classes.
            </p>

            <button
              tabIndex={-1}
              type="button"
              className="btn btn-link"
              onClick={ function(e) {
                e.preventDefault();
                this.toggleReadMore();
              }.bind(this) }
              >
              Read
              { ' ' }
              { this.state.readMore ? 'less': 'more' }
              ...
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Stepper
              steps={ [
                {
                  title: 'Credentials',
                }, 
                {
                  title: 'Comrades',
                  onClick: function (e) {
                    e.preventDefault();
                    alert('hey');
                  }
                },
                {
                  title: 'Communications'
                },
                {
                  title: 'Communism'
                }
              ] }
              activeStep={ this.state.activeStep }
              />

            <div id="cred" className={ this.state.activeStep === 0 ? '' : 'collapse' }>
              <div className="row">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    onChange={ (e) => {
                      this.setState({
                        accountSID: e.target.value, credValid: false
                      });
                    } }
                    value={ this.state.accountSID }
                    />
                  <small className="text-muted">
                    Enter your Account SID here.
                  </small>
                </div>
                <div className="col-md-4">
                  <input 
                    type="password" 
                    className="form-control" 
                    onChange={ (e) => {
                      this.setState({
                        authToken: e.target.value, credValid: false
                      });
                    } }
                    value={ this.state.authToken }
                    />
                  <small className="text-muted">
                    Enter your Auth Token here.
                  </small>
                </div>
                <div className="col-md-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    onChange={ (e) => {
                      this.setState({
                        fromPhone: e.target.value, credValid: false
                      });
                    } }
                    value={ this.state.fromPhone }
                    />
                  <small className="text-muted">
                    Enter your <code>From:</code> phone number here.
                    </small>
                </div>
              </div>
              <div className="m-3">
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm"
                  onClick={ this.validate }
                  disabled={ !this.haveCred() || this.state.loading || this.state.credValid }
                  >
                  Validate
                  { this.state.credValid ? 'd' : null }
                </button>
                <span className="ml-3">
                  { this.state.loading ? 'Loading...' : null }
                  { this.state.credValid ? 'Validated!' : 'Invalid.' }
                </span>
              </div>
              <input 
                type="text" 
                className="form-control" 
                onChange={ (e) => {
                  this.setState({ ownPhone: e.target.value, credValid: false });
                } }
                value={ this.state.ownPhone }
                />
              <small className="text-muted">
                Optionally, enter your own phone number here to send yourself
                a test message.
              </small>
              <div className="m-3">
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm"
                  onClick={ this.sendTest }
                  disabled={ !this.state.credValid }
                  >
                  Send
                </button>
              </div>
            </div>
            <div
              id="comr"
              className={ this.state.activeStep === 1 ? '' : 'collapse' }
              >
              <div className="row">
                <div className="col-md-6">
                  <ComradeInput
                    submit={(comrades) => this.setState({ comrades })}
                    />
                </div>
                <div className="col-md-6">
                  Valid (<code>{'^\\+1[\\d]{10}$'}</code>):
                  <ul>
                    {this.state.comrades.filter(c => {
                      return /^\+1[\d]{10}$/.test(c);
                    }).map((c, i) => {
                      return <li key={i}>{c}</li>;
                    })}
                  </ul>
                  Invalid:
                  <ul>
                    {this.state.comrades.filter(c => {
                      return !/^\+1[\d]{10}$/.test(c)
                    }).map((c, i) => {
                      return <li key={i}>{c}</li>;
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div id="comm" className={ this.state.activeStep === 2 ? '' : 'collapse' }>
              <p>This screen sends!</p>
            </div>
            <div id="cmnm" className={ this.state.activeStep === 3 ? '' : 'collapse' }>
              <p>Check out a local chapter of DSA sometime!</p>
            </div>

            <div style={{ float: 'right' }}>
            <button
              onClick={ () => this.step(1) }
              type="button"
              className="btn btn-warning"
              disabled={ this.state.activeStep === 0 }>Back</button>
            <button
              onClick={ () => this.step(0) }
              type="button"
              className="btn btn-success ml-2"
              disabled={ this.state.activeStep === 3 }>Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// import React, { Component } from 'react';

class ComradeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comrades: '',
      delimiter: ' '
    };

    this.click = this.click.bind(this);
  }

  click () {
    var comrades = this.state.comrades.split(this.state.delimiter);
    this.props.submit(comrades);
  }

  render() {
    return (
      <div>
        <div className="m-3">
          <textarea
            value={ this.state.comrades }
            onChange={ (e) => this.setState({ comrades: e.target.value }) }
            >
          </textarea>
        </div>
        <div className="m-3">
          <input
            id="delimiter"
            type="text" 
            className="form-control"
            onKeyDown={ e => {
              if (e.keyCode === 13) {
                e.preventDefault();
                this.setState({ delimiter: this.state.delimiter + "\n" });
              }
            }} 
            onChange={ (e) => {
              this.setState({ delimiter: e.target.value });
            } }
            value={ this.state.delimiter }
            />
          <small className="text-muted">Specify delimiter.</small>
        </div>
          
        <button
          onClick={ this.click }
          type="button"
          className="btn btn-dark btn-sm">
          Preview
        </button>
      </div>
    );
  }
}

// export default ComradeInput;
