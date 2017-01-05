/* globals $ */

const React = require('react');
const $ = require('jquery');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');
import {apiHost} from '../../config/globals';
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
    return {
      widgets: [],
      editMode: false
    };
  },

  onSuccessfulGoogleLogin: function(googleUser) {
    $.post(apiHost + '/api/login',
      {access_token: googleUser.accessToken},
      function (response) {
        window.localStorage.setItem("authToken", response.auth_token);
      }
    );
  },

  componentDidMount: function () {
    this.retreiveWidgets();
  },

  retreiveWidgets: function() {
    const parent = this;
    $.get(apiHost + '/api/dashboards/default', function (data) {
        parent.setState({widgets: data.widgets});
      }
    );
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

  render: function() {
    return (
      <div>
        <DashboardGrid  {...this.props}
        widgets={this.state.widgets}
        editMode={this.state.editMode}
        onSave={this.onSave()}
        enterEditMode={this.switchToEditMode}
        refreshDashboard={this.retreiveWidgets}/>

        <GoogleLogin
          clientId="367265145793-0g4m0hto4ska61utd7gkape5ckr1rdq4.apps.googleusercontent.com"
          buttonText="Google Login"
          onSuccess={this.onSuccessfulGoogleLogin}
        />
      </div>
    );
  }
});

module.exports = SpotlightWindow;
