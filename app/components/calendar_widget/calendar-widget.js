const React = require('react');
const moment = require('moment');
const _ = require('underscore');

const maxTitleLength = 32;

import {apiHost} from '../../config/globals';

require('./calendar-widget.scss');

const CalendarWidget = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    uuid: React.PropTypes.string.isRequired,
    refreshInterval: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      refreshInterval: 5 * 60 * 1000
    };
  },

  getInitialState: function() {
    return {
      events: [],
      timerId: null,
    };
  },

  componentDidMount: function() {
    this.updateEvents();
    const updateTimerId = setInterval(this.updateEvents, this.props.refreshInterval);
    this.setState({timerId: updateTimerId});
  },

  componentWillUnmount: function() {
    clearInterval(this.state.timerId);
  },

  updateEvents: function() {
    const component = this;
    const gcalUrl = apiHost + '/api/gcal/' + this.props.uuid;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    };
    fetch(gcalUrl, options)
    .then(function(response) {
      return response.json();
    }).then( function(json) {
      component.setState({
        events: json.events
      });
    });
  },

  truncatedTitle: function(title) {
    return (title.length > maxTitleLength) ?
      (title.substring(0, maxTitleLength - 3) + '...') :
      title;
  },

  renderEvent: function(eventData) {
    return (
      <div className="event">
        <div className="timestamp">
          <span>{moment(eventData.start).fromNow()}</span>
        </div>
        <div className="title"> {this.truncatedTitle(eventData.title)} </div>
        <div className="duration"> for
          <span className="humanized-duration">
            {' ' +  moment.duration(moment(eventData.end) - moment(eventData.start)).humanize() + '.'}
          </span>
        </div>
      </div>
    );
  },

  renderEvents: function() {
    return ( _.map(this.state.events, this.renderEvent));
  },

  render: function() {
    return (
      <div className="calendar" data-uuid={this.props.uuid}>
        <div className = "events">
          {this.renderEvents()}
        </div>
      </div>
    );
  }
});

module.exports = CalendarWidget;
