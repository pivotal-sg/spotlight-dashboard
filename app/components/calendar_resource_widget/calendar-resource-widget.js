const React = require('react');
const moment = require('moment');
const _ = require('underscore');
const Clock = require('../clock_widget/clock-widget');

import {apiHost} from '../../config/globals';

require('./calendar-resource-widget.scss');

const CalendarResourceWidget = React.createClass({
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
    this.updateAvailability();
    const updateTimerId = setInterval(this.updateAvailability, this.props.refreshInterval);
    this.setState({timerId: updateTimerId});
  },

  componentWillUnmount: function() {
    clearInterval(this.state.timerId);
  },

  updateAvailability: function() {
    const component = this;
    const gcalUrl = apiHost + '/api/gcal/' + this.props.uuid + '/availability';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Spotlight-Token': localStorage.getItem('authToken')
      }
    };
    fetch(gcalUrl, options)
    .then(function(response) {
      return response.json();
    }).then( function(json) {
      console.log('JSON ', json);
      component.setState({
        available: json.available,
        next_booking_at: json.next_booking_at,
        next_available_at: json.next_available_at
      });
    });
  },

  availability: function() {
    var status;

    if (this.state.available) {
      status = 'Available';
    }
    else {
      status = 'Booked'
    }

    return status;
  },

  nextText: function() {
    var nextText, timeText;

    if (this.state.available) {
      timeText = moment(this.state.next_booking_at).fromNow();
    }
    else {
      timeText = moment(this.state.next_available_at).fromNow();
    }

    return timeText.replace('in ', '').replace(' ago', '');
  },

  render: function() {
    let resourceAvailabilityClassName = this.state.available ? 'available' : 'booked';
    return (
        <div className={'calendar-resource ' + resourceAvailabilityClassName} data-uuid={this.props.uuid}>
          <div className="title"> {this.props.title} </div>
          <div className="sign"> { this.availability() } </div>
          <div>
            <span className="nextText">for</span> <span className="nextTime">{ this.nextText() }</span>
          </div>
      </div>
    );
  }
});

module.exports = CalendarResourceWidget;
