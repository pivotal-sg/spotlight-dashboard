const React = require('react');

let ReactGridLayout = require('react-grid-layout');
const widthProvider = ReactGridLayout.WidthProvider;
ReactGridLayout = widthProvider(ReactGridLayout);

const DashboardButton = require('../dashboard_button/dashboard-button');
const CiWidgetContainer = require('../ci_widget_container/ci-widget-container');
const _ = require('underscore');

require('./react-grid-layout.scss');
require('./dashboard-grid.scss');
require('./widget.scss');

const DashboardGrid = React.createClass({
  displayName: 'Dashboard Grid',

  propTypes: {
    dashboardId: React.PropTypes.number.isRequired,
    onSave: React.PropTypes.func.isRequired,
    widgets: React.PropTypes.array.isRequired,
    editMode: React.PropTypes.bool.isRequired
  },

  getDefaultProps: function() {
    return {
      autoSize: true,
      cols: 12,
      rowHeight: 100,
      margin: [10, 10],
      minH: 2,
      minW: 1,
      maxH: 12,
      maxW: 12,
      useCSSTransforms: true,
      listenToWindowResize: true,
      verticalCompact: true,
      className: 'layout'
    };
  },

  getInitialState: function() {
    return {currentLayout: []};
  },


  persistLayout: function() {
    const url = '/api/dashboards/' + this.props.dashboardId + '/layout';
    const options = {
      method: 'PUT',
      data: JSON.stringify({layout: this.state.currentLayout}),
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        accept: 'application/json',
        content_type: 'application/json'
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
    return _.map(this.props.widgets, function(widget) {
      return (<div key={widget.uuid} _grid={widget.layout}>
                <div className = "widget card">
                  <CiWidgetContainer {...widget}/>
                </div>
              </div>);
    });
  },

  dashboardClass: function() {
    const mode = this.props.editMode ? 'edit' : 'view';
    return 'dashboard ' + mode;
  },

  render: function() {
    return (
      <div className={ this.dashboardClass() }>
        <DashboardButton action="save" href="eval(javascript:void(0);)" onClick={this.persistLayout} tooltip="Save Layout" editOnly={true}/>
        <DashboardButton action="add" href="/widgets/new" tooltip="New Widget" editOnly={true}/>
        <DashboardButton action="edit" href="/dashboards?edit=true" tooltip="Edit Dashboard" editOnly={false}/>

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
