const React = require('react');
const CiWidgetContainer = require('../ci_widget_container/ci-widget-container');
const ClockWidget = require('../clock_widget/clock-widget');

require('./widget.scss');

import {apiHost} from '../../config/globals';

const Widget = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    uuid: React.PropTypes.string.isRequired,
    widgetPath: React.PropTypes.string.isRequired,
    refreshDashboard: React.PropTypes.func.isRequired,
    category: React.PropTypes.string.isRequired
  },

  deleteWidget: function() {
    const component = this;
    let data = new FormData();
    data.append('_method', 'delete');

    const url = apiHost + this.props.widgetPath;
    const options = {
      method: 'post',
      mode: 'no-cors',
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    window.fetch(url, options)
    .then(function(response) {
      console.log('success: ' + response);
      component.props.refreshDashboard();
    }).catch(function(error) {
      console.log('request failed: ', error);
    });
  },

  renderWidget: function() {
    const widgetCategory = {
      'ci_widget': CiWidgetContainer,
      'clock_widget': ClockWidget
    };
    const WidgetType = widgetCategory[this.props.category];
    return <WidgetType {...this.props}/>;
  },

  render: function() {
    return (
      <div className = "widget card">
        {this.renderWidget()}

        <div className="buttons edit-only">
          <a className="delete btn-floating waves-effect waves-light white-text red tooltipped"
            data-tooltip="Remove Widget"
            rel="nofollow"
            href="javascript:void(0);"
            onClick={this.deleteWidget}>
              <i className="tiny material-icons">delete</i>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = Widget;
