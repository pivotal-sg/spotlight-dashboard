/* globals $ */

const React = require('react');
const $ = require('jquery');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');
import {apiHost, googleClientId} from '../../config/globals';
import GoogleLogin from 'react-google-login';

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
    const authToken = localStorage.getItem('authToken');

    return {
      widgets: [],
      editMode: false,
      loggedIn: !!authToken
    };
  },

  onSuccessfulGoogleLogin: function(googleUser) {
    let me = this;

    $.post(apiHost + '/get_auth_token',
      {id_token: googleUser.getAuthResponse().id_token},
      function (response) {
        window.localStorage.setItem("authToken", response.auth_token);
        me.setState({"loggedIn": true});
        me.retrieveWidgets();
      }
    );
  },

  componentDidMount: function () {
    this.retrieveWidgets();
  },

  retrieveWidgets: function() {
    const parent = this;
    $.ajax({
      headers: {
        'X-Spotlight-Token': localStorage.getItem('authToken')
      },
      type: 'GET',
      url: apiHost + '/api/dashboards/default',
      success: (data) => {
        parent.setState({widgets: data.widgets});
      }
    });
  },

  defaultOnSave: function() {
    this.setState({editMode: false});
  },

  onSave: function() {
    return (this.props.onSave || this.defaultOnSave);
  },

  switchToEditMode: function() {
    this.setState({editMode: true});
  },

  renderSplitWindow: function() {
    const {loggedIn} = this.state;

    if(loggedIn) {
      return (<DashboardGrid
                {...this.props}
                widgets={this.state.widgets}
                editMode={this.state.editMode}
                onSave={this.onSave()}
                enterEditMode={this.switchToEditMode}
                refreshDashboard={this.retrieveWidgets}
              />
      );
    } else {
      return (<GoogleLogin
                clientId={googleClientId}
                buttonText="Google Login"
                onSuccess={this.onSuccessfulGoogleLogin}
              />
      );
    }
  },

  render: function() {
    return (
      <div>
        {this.renderSplitWindow()}
      </div>
    );
  }
});

module.exports = SpotlightWindow;
