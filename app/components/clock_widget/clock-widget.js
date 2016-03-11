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

  ding: function() {
    const sound = document.getElementById('audio');
    sound.play();
  },

  updateClock: function() {
    this.setState({
      time: moment().format('H:mm:ss'),
      date: moment().format('dddd, DD MMM')
    });
    if (moment().format('HH:mm:ss') === '09:06:00') {
      this.ding();
    }
  },

  render: function() {
    return (
      <div className="clock">
        <audio id="audio" src="http://www.soundjay.com/mechanical/sounds/clong-1.mp3" autostart="false" />
        <div className="time"> {this.state.time} </div>
        <div className="date"> {this.state.date} </div>
      </div>
    );
  }
});

module.exports = ClockWidget;
