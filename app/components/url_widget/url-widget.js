const React = require('react');
const moment = require('moment');

require('./url-widget.scss');
import {apiHost} from '../../config/globals';

const UrlWidget = React.createClass({
  getInitialState: function() {
    return {
        url: ''
    };
  },

  componentDidMount: function() {
    this.updateUrl();
    const timerIntervalId = setInterval(this.updateComic, 5 * 60 * 1000);
    this.setState({timerId: timerIntervalId});
  },

  componentWillUnmount: function() {
    clearInterval(this.state.timerId);
  },

  updateUrl: function() {
    const component = this;
    const apiUrl = apiHost + '/api/url/' + this.props.uuid ;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Spotlight-Token': localStorage.getItem('authToken')
      }
    };
    fetch(apiUrl, options)
    .then(function(response) {
      return response.json();
    }).then( function(json) {
      component.setState({
        url: json.url
      });
    });
  },

  render: function() {
    const iframeStyle =  {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      position: 'absolute'
    };

    return (
      <div className="iframe-wrapper">
        <iframe src={this.state.url} className={{iframeStyle}} height="100%" width="100%"/>
      </div>
    );
  }
});

module.exports = UrlWidget;
