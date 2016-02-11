const React = require('react');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');
import {apiHost} from '../../config/globals';

const SpotlightWindow = React.createClass({
  displayName: 'Spotlight window',

  propTypes: {
    dashboardId: React.PropTypes.number.isRequired,
    onSave: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      dashboardId: 1
    };
  },

  getInitialState: function() {
    return {
      widgets: [
        {
          uuid: 'c3c2e397-2b24-4d1d-a577-8a130b041ed2',
          title: 'Spotlight',
          category: 'ci_widget',
          layout: {
            h: 5,
            w: 3,
            x: 0,
            y: 0
          }
        }
      ],
      editMode: true
    };
  },

  componentDidMount: function() {
    this.retreiveWidgets();
  },

  retreiveWidgets: function() {
    const parent = this;
    fetch(apiHost + '/api/dashboards/default')
      .then(function(response) {return response.json(); })
      .then(function(json) { parent.setState({widgets: json.widgets}); });
  },

  defaultOnSave: function() {
    // window.location.href = 'dashboards';
  },

  onSave: function() {
    return (this.props.onSave || this.defaultOnSave);
  },

  render: function() {
    return (
      <div>
        <DashboardGrid  {...this.props} widgets={this.state.widgets} editMode={this.state.editMode} onSave={this.onSave()}/>
      </div>
    );
  }
});

module.exports = SpotlightWindow;
