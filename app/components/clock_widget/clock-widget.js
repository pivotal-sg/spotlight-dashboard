const React = require('react');
const CiWidget = require('../ci_widget/ci-widget');
import {apiHost} from '../../config/globals';

const CiWidgetContainer = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    uuid: React.PropTypes.string.isRequired,
    widgetPath: React.PropTypes.string.isRequired,
    refreshDashboard: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      time: '2:00:00 pm'
    };
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

  render: function() {
    return (
      <div className="clock-widget card-content" data-uuid={this.props.uuid}>
        <div className="time"> {this.state.time} </div>

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

module.exports = CiWidgetContainer;
