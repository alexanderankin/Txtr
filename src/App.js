import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import Stepper from 'react-stepper-horizontal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({
      readMore: false,
      activeStep: 0,
      accountSID: '',
      authToken: '',
      fromPhone: '',
      credValid: false,
      loading: false,
      ownPhone: '',
      comrades: [],
      message: ''
    }, JSON.parse(window.localStorage.txtrLS));

    this.step = this.step.bind(this);
    this.toggleReadMore = this.toggleReadMore.bind(this);
    this.haveCred = this.haveCred.bind(this);
    this.validate = this.validate.bind(this);
    this.backup = this.backup.bind(this);
    this.sendTest = this.sendTest.bind(this);
  }

  backup() {
    window.localStorage.txtrLS = JSON.stringify(this.state);
  }

  step(isStepBack) {
    var { activeStep } = this.state;
    activeStep += (isStepBack ? -1 : 1);
    this.setState({
      activeStep
    }, () => this.backup());
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
    var body = 'Sending Txtr Test: ' + new Date();
    shootText(
      this.state.accountSID,
      this.state.authToken,
      this.state.fromPhone,
      body,
      this.state.ownPhone,
      function (e) {
        if (e) { setTimeout(function() { alert("Error " + e.message); }); }
      });
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
            <p className={ this.state.readMore ? "" : "collapse"}>
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
            <p className={ this.state.readMore ? "" : "collapse"}>
              When you switch steps, your entered information is saved locally
              so that when you refresh the page it's still there.
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
                  onClick: (e) => {
                    e.preventDefault();
                    this.setState({ activeStep: 0 });
                  }
                }, 
                {
                  title: 'Comrades',
                  onClick: (e) => {
                    e.preventDefault();
                    this.setState({ activeStep: 1 });
                  }
                },
                {
                  title: 'Communications',
                  onClick: (e) => {
                    e.preventDefault();
                    this.setState({ activeStep: 2 });
                  }
                },
                {
                  title: 'Communism',
                  onClick: (e) => {
                    e.preventDefault();
                    this.setState({ activeStep: 3 });
                  }
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
                  this.setState({ ownPhone: e.target.value });
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
                  <p>Preview phone number list:</p>
                  <p>Valid (<code>{'^\\+1[\\d]{10}$'}</code>):</p>
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
              <div className="m-3">
                <div className="row">
                  <div className="col-md-3 text-right">
                    <p><small className="text-muted">Enter body of mass message:</small></p>
                  </div>
                  <div className="col-md-9">
                    <textarea
                      id="testing"
                      value={ this.state.message }
                      onChange={ (e) => this.setState({ message: e.target.value }) }
                      >
                    </textarea>
                  </div>
                </div>
              </div>
              <Communications
                comrades={ this.state.comrades }
                senderTest={ shootText.bind(null,
                  this.state.accountSID,
                  this.state.authToken,
                  this.state.fromPhone,
                  this.state.message,
                  this.state.ownPhone) }
                senderAny={ (to, done) => {
                  shootText(
                    this.state.accountSID,
                    this.state.authToken,
                    this.state.fromPhone,
                    this.state.message,
                    to, done);
                  } }
                />
            </div>
            <div id="cmnm" className={ this.state.activeStep === 3 ? '' : 'collapse' }>
              {/*<p>Check out a local chapter of DSA sometime!</p>*/}
              <p>Lorem ipsum amet adipisicing sint sed et enim eiusmod nulla occaecat aliqua anim magna culpa non sunt in do.</p>
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

var phone = require('phone');

function attemptToStandarizePhone(number) {
  var result = phone(number);
  if (result && result.length > 0) { return result[0]; }
  return number;
}


class ComradeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comrades: '',
      customDelimiter: ' ',
      delimiter: ' ',
    };

    this.click = this.click.bind(this);

    this.labelStyle = { width: '25%' };
  }

  click () {
    var comrades = this.state.comrades.split(this.state.delimiter);
    this.props.submit(comrades.map(attemptToStandarizePhone));
  }

  render() {
    return (
      <div>
        <div className="m-3">
          <p><small className="text-muted">Paste phone numbers.</small></p>
          <textarea
            value={ this.state.comrades }
            onChange={ (e) => this.setState({ comrades: e.target.value }) }
            >
          </textarea>
        </div>
        <div className="m-3">
          <p><small className="text-muted">Select delimiter.</small></p>
          <label className="c-input c-radio" style={this.labelStyle}>
            <input
              id="radio1"
              name="radio"
              type="radio"
              checked={this.state.delimiter === " "}
              onChange={() => this.setState({ delimiter: " "})}
              />
            <span className="c-indicator"></span>
            { ' ' }
            Space
          </label>
          <label className="c-input c-radio" style={this.labelStyle}>
            <input
              id="radio2"
              name="radio"
              type="radio"
              checked={this.state.delimiter === "\t"}
              onChange={() => this.setState({ delimiter: "\t"})}
              />
            <span className="c-indicator"></span>
            { ' ' }
            Tab
          </label>
          <label className="c-input c-radio" style={this.labelStyle}>
            <input
              id="radio3"
              name="radio"
              type="radio"
              checked={this.state.delimiter === "\n"}
              onChange={() => this.setState({ delimiter: "\n"})}
              />
            <span className="c-indicator"></span>
            { ' ' }
            Enter
          </label>
          <label className="c-input c-radio" style={this.labelStyle}>
            <input
              id="radio4"
              name="radio"
              type="radio"
              checked={" \t\n".indexOf(this.state.delimiter) === -1}
              onChange={() => this.setState({ delimiter: this.state.customDelimiter })}
              />
            <span className="c-indicator"></span>
            { ' ' }
            Custom:
          </label>
          <input

            id="custom-delimiter"
            type="text" 
            className="form-control"
            onChange={ (e) => {
              this.setState({ customDelimiter: e.target.value });
            } }
            value={ this.state.customDelimiter }
            />
          <small className="text-muted">Specify custom delimiter.</small>
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


// import React, { Component } from 'react';


class Communications extends Component {
  static propTypes = {
    comrades: PropTypes.arrayOf(PropTypes.string).isRequired,
    senderTest: PropTypes.func.isRequired,
    senderAny: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    console.log(props);

    this.meatAndPotatoes = this.meatAndPotatoes.bind(this);
  }

  meatAndPotatoes() {
    var errors = [];
    (function sendNextText(comrades, comradeIndex) {
      if (comradeIndex === comrades.length) {
        alert("there were " + errors.length + " errors.");
        console.log(errors);
        return; // were done
      }

      this.props.senderAny(comrades[comradeIndex], function (err) {
        if (err) { errors.push(err); }
        sendNextText(comrades, comradeIndex + 1);
      });
    }.bind(this))(this.props.comrades, 0);
  }

  render() {
    var btnStyle = {
      borderRadius: '100%',
      display: 'inline-block',
      lineHeight: '200px',
      width: '210px',
      margin: '0 auto'
    };
    return (
      <div className="row">
        <div className="col-md-6 text-center">
          <button
            type="button"
            className="btn btn-light btn-sm"
            style={ Object.assign({ background: '#e95' }, btnStyle) }
            onClick={ (e) => this.props.senderTest(err => alert(err)) }
            >
            Send me a test message
          </button>
        </div>
        <div className="col-md-6 text-center">
          <button
            type="button"
            className="btn btn-light btn-sm"
            style={ Object.assign({ background: '#4f3' }, btnStyle) }
            onClick={ (e) => this.meatAndPotatoes(e) }
            >
            Send mass text message
          </button>
        </div>
      </div>
    );
  }
}

// export default Communications;

function shootText(sid, token, From, Body, To, callback) {
  console.log(arguments);
  var url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  // var url = `http://localhost:3030`;
  var basic = sid + ':' + token;

  var body = [];
  var details = { From, Body, To };
  for (var k in details) {
    var eK = encodeURIComponent(k);
    var eDetail = encodeURIComponent(details[k]);
    body.push(eK + '=' + eDetail);
  }
  var bodyStr = body.join('&');


  fetch(url, {
    method: 'post',
    headers: {
      Authorization: "Basic " + btoa(basic),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyStr
  })
    .then(response => response.json())
    .then(body => {
      if (body.error_code !== null) {
        callback(body);
      }
    })
    .then(callback.bind(null, null))
    .catch(callback);
}

function testShootText() {
  var myTestSid = 'ACd013d591455511844cb082cdfeb6219c';
  var myTestTok = 'a4f8a3f066076b3d71aa2ee22ca85ae1';
  var twMagicNo = '+15005550006';

  var myNo = '+12679925122';

  shootText(myTestSid, myTestTok, twMagicNo, 'ok', myNo, function (err) {
    console.log("done with err:", err);
  });
}
