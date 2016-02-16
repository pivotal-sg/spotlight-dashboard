const React = require('react');

const ClockWidget = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  getInitialState: function() {
    return {
      time: '2:00:00 pm'
    };
  },

  render: function() {
    return (
      <div className="time"> {this.state.time} </div>
    );
  }
});

module.exports = ClockWidget;
