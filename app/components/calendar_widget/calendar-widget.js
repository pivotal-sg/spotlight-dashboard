const React = require('react');
const moment = require('moment');
const _ = require('underscore');
const Clock = require('../clock_widget/clock-widget');

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

  timeTitle: function(startTime) {
    if(startTime.hour() === 0) { //starts midnight (all day events)
      const formattedStartDate = startTime.format('DD-MM-YYYY');
      const today = moment().format('DD-MM-YYYY');
      const tomorrow = moment().add(1, 'day').format('DD-MM-YYYY');

      if(formattedStartDate === today) { return 'Today'; }
      if(formattedStartDate === tomorrow) { return 'Tomorrow' };
    }
    return  startTime.fromNow();
  },

  renderEvent: function(eventData) {
    return (
      <div className="event">
        <div className="timestamp">
          <span>{this.timeTitle(moment(eventData.start))}</span>
        </div>
        <div className="title"> {eventData.title} </div>
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
      <div className="clock-and-cal">
        <Clock title="clock"/>
        <div className="calendar" data-uuid={this.props.uuid}>
          <div className = "events">
            {this.renderEvents()}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = CalendarWidget;
