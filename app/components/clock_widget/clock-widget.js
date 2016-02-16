const React = require('react');
const moment = require('moment');

require('./clock-widget.scss');

const ClockWidget = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      time: null,
      date: null
    };
  },

  componentDidMount: function() {
    this.updateClock();
    const timerIntervalId = setInterval(this.updateClock, 1000);
    this.setState({timerId: timerIntervalId});
  },

  componentWillUnmount: function() {
    clearInterval(this.state.timerId);
  },

  updateClock: function() {
    this.setState({
      time: moment().format('H:mm:ss'),
      date: moment().format('dddd, DD MMM')
    });
  },

  render: function() {
    return (
      <div className="clock">
        <div className="time"> {this.state.time} </div>
        <div className="date"> {this.state.date} </div>
      </div>
    );
  }
});

module.exports = ClockWidget;
