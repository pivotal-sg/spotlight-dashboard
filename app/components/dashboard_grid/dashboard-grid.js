/*globals $ */
const React = require('react');

let ReactGridLayout = require('react-grid-layout');
const widthProvider = ReactGridLayout.WidthProvider;
ReactGridLayout = widthProvider(ReactGridLayout);

const DashboardButton = require('../dashboard_button/dashboard-button');
const Widget = require('../widget/widget');
const _ = require('underscore');

import {apiHost, addPath} from '../../config/globals';

require('./react-grid-layout.scss');
require('./dashboard-grid.scss');

const DashboardGrid = React.createClass({
  displayName: 'Dashboard Grid',

  propTypes: {
    dashboardId: React.PropTypes.number.isRequired,
    onSave: React.PropTypes.func.isRequired,
    widgets: React.PropTypes.array.isRequired,
    editMode: React.PropTypes.bool.isRequired,
    enterEditMode: React.PropTypes.func.isRequired,
    refreshDashboard: React.PropTypes.func.isRequired,
    hideButtonTimeout: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      autoSize: true,
      cols: 12,
      rowHeight: 25,
      margin: [10, 10],
      minH: 2,
      minW: 1,
      maxH: 100,
      maxW: 12,
      useCSSTransforms: true,
      listenToWindowResize: true,
      verticalCompact: true,
      className: 'layout',
      hideButtonTimeout: 1 * 60 * 1000
    };
  },

  getInitialState: function() {
    return {currentLayout: []};
  },

  componentDidMount: function() {
    setTimeout(function() { $('.edit-button').hide(); }, this.props.hideButtonTimeout);
  },

  persistLayout: function() {
    const url = apiHost + '/api/dashboards/' + this.props.dashboardId + '/layout';
    const options = {
      method: 'post',
      body: JSON.stringify({layout: this.state.currentLayout}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Spotlight-Token': localStorage.getItem('authToken')
      }
    };


    fetch(url, options)
      .then(this.props.onSave);
  },

  updateLayout: function(layout) {
    this.state.currentLayout = layout;
    // we think this sound be setState() but this is causing a recursion loop
    // which we think is caused by setState() triggering a layout change that ReactGridLayout is picking up on and re-triggering this method again, etc...
  },

  renderWidgets: function() {
    const component = this;
    return _.map(this.props.widgets, function(widget) {
      return (
        <div key={widget.uuid} data-grid={widget.layout}>
          <Widget {...widget} refreshDashboard={component.props.refreshDashboard}/>
        </div>
      );
    });
  },

  dashboardClass: function() {
    const mode = this.props.editMode ? 'edit' : 'view';
    return 'dashboard ' + mode;
  },

  handleAddClicked: function(e) {
    e.preventDefault();
    document.getElementById('add-widget').submit();
  },

  renderAddButton: function() {
    return (
      <div>
        <form id="add-widget" method="post" action={apiHost + '/login'}>
          <input type="hidden" name="auth_token" value={localStorage.getItem('authToken')} />
          <input type="hidden" name="redirect_url" value={apiHost + addPath} />
        </form>
        <DashboardButton action="add" href="#" onClick={this.handleAddClicked} tooltip="New Widget" editOnly={true}/>
      </div>
    )
  },

  render: function() {
    return (
      <div className={ this.dashboardClass() }>
        <DashboardButton action="edit" href="javascript:void(0);" onClick={this.props.enterEditMode} tooltip="Edit Dashboard" editOnly={false}/>
        <DashboardButton action="save" href="javascript:void(0);" onClick={this.persistLayout} tooltip="Save Layout" editOnly={true}/>
        {this.renderAddButton()}

        <ReactGridLayout
          {...this.props}
          isDraggable={this.props.editMode}
          isResizable={this.props.editMode}
          onLayoutChange={this.updateLayout}>
          {this.renderWidgets()}
        </ReactGridLayout>
      </div>
    );
  }
});

module.exports = DashboardGrid;
