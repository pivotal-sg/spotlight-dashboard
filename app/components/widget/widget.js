const React = require('react');
const CiWidgetContainer = require('../ci_widget_container/ci-widget-container');
const ClockWidget = require('../clock_widget/clock-widget');
const CalendarWidget = require('../calendar_widget/calendar-widget');
const CalendarResourceWidget = require('../calendar_resource_widget/calendar-resource-widget');
const ComicWidget = require('../comic_widget/comic-widget');
const UrlWidget = require('../url_widget/url-widget');
import OpenairWidget from '../openair_widget/openair-widget';

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

  deleteWidgetConfirm: function() {
    if(confirm('You are about to permanently delete this widget. This change cannot be undone. Are you sure?')) {
      this.deleteWidget();
    }
  },

  deleteWidget: function() {
    const component = this;

    const url = apiHost + this.props.widgetPath;
    const options = {
      method: 'delete',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Spotlight-Token': localStorage.getItem('authToken')
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
      'ci_concourse_widget': CiWidgetContainer,
      'clock_widget': ClockWidget,
      'gcal_widget': CalendarWidget,
      'gcal_resource_widget': CalendarResourceWidget,
      'comic_widget': ComicWidget,
      'url_widget': UrlWidget,
      'openair_widget': OpenairWidget
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
            onClick={this.deleteWidgetConfirm}>
              <i className="tiny material-icons">delete</i>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = Widget;
