const React = require('react');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');

const SpotlightWindow = React.createClass({
  displayName: 'Spotlight window',

  propTypes: {
    dashboardId: React.PropTypes.number.isRequired,
    onSave: React.PropTypes.func,
    widgets: React.PropTypes.array.isRequired,
    editMode: React.PropTypes.bool.isRequired
  },

  getDefaultProps: function() {
    return {
      dashboardId: 1,
      widgets: [
        {
          uuid: 'c3c2e397-2b24-4d1d-a577-8a130b041ed2',
          title: 'Spotlight',
          category: 'ci_widget',
          layout: { h: 5,
          w: 3,
          x: 0,
          y: 0}
        }
      ],
      editMode: true
    };
  },

  defaultOnSave: function() {
    window.location.href = 'dashboards';
  },

  onSave: function() {
    return (this.props.onSave || this.defaultOnSave);
  },

  render: function() {
    return (
      <div>
        <DashboardGrid  {...this.props} onSave={this.onSave()}/>
      </div>
    );
  }
});

module.exports = SpotlightWindow;
