const React = require('react');
const $ = require('jquery');
import ReactTestUtils from 'react-addons-test-utils'
const expect = require('chai').expect;
const SpotlightWindow = require('./spotlight-window');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');
import GoogleLogin from 'react-google-login';

describe('SpotlightWindow', function() {
  const testProps = {
    onSave: 'fakeOnSave'
  };

  beforeEach(function() {
    sinon.stub($, 'ajax');
  });

  afterEach(function() {
    $.ajax.restore();
  });

  describe('renders correct component based on login status', function() {
    context('authToken exists in localStorage', function () {
      it('renders dashboard grid', function() {
        localStorage.setItem('authToken', 'FAKE_AUTH_TOKEN');

        const renderer = ReactTestUtils.createRenderer();
        renderer.render( <SpotlightWindow {...testProps}/>);
        const result = renderer.getRenderOutput();

        const dashboard = result.props.children;
        expect(ReactTestUtils.isElementOfType(dashboard, DashboardGrid)).to.equal(true);
        expect(dashboard.props.onSave).to.equal('fakeOnSave');
      });
    });

    context('authToken does not exist in localStorage', function () {
      it('renders google login button', function() {
        localStorage.clear();

        const renderer = ReactTestUtils.createRenderer();
        renderer.render( <SpotlightWindow {...testProps}/>);
        const result = renderer.getRenderOutput();

        const dashboard = result.props.children;
        expect(ReactTestUtils.isElementOfType(dashboard, GoogleLogin)).to.equal(true);
      });
    });
  });

  describe('switchToEditMode', function() {
    it('changes state', function() {
      const component = ReactTestUtils .renderIntoDocument(<SpotlightWindow {...testProps}/>);
      expect(component.state.editMode).to.equal(false);
      component.switchToEditMode();
      expect(component.state.editMode).to.equal(true);
    });
  });

  describe('onSave', function() {
    it('switches back to vies only mode', function() {
      const component = ReactTestUtils .renderIntoDocument(<SpotlightWindow {...testProps}/>);
      component.setState({editMode: true});
      component.defaultOnSave();
      expect(component.state.editMode).to.equal(false);
    });
  });

  // TODO: assert api calls have token in the header
  describe('onSuccessfulGoogleLogin', function() {
    let component;
    const googleUser = { accessToken: 'FAKE_ACCESS_TOKEN'};

    beforeEach(function() {
      component = ReactTestUtils .renderIntoDocument(<SpotlightWindow {...testProps}/>);
      sinon.stub($, "post")
    });

    afterEach(function() {
      $.post.restore();
    });

    it('sends over the access token to the api', function(){
      component.onSuccessfulGoogleLogin(googleUser);

      const callArgs = $.post.args[0];
      const url = callArgs[0];
      const postData = callArgs[1];

      expect(url).to.contain('/login');
      expect(postData).to.deep.equal({access_token: 'FAKE_ACCESS_TOKEN'});
    });

    it('saves the response authToken in localStorage', function () {
      $.post.yields({auth_token: 'foo'});
      component.onSuccessfulGoogleLogin(googleUser);

      expect(window.localStorage.getItem("authToken")).to.equal('foo');
    })

  });

  describe('retreiveWidgets', function() {
    let component;

    beforeEach(function() {
      component = ReactTestUtils .renderIntoDocument(<SpotlightWindow {...testProps}/>);
    });

    it('retreives all widgets', function() {
      component.retreiveWidgets();

      const callArgs = $.ajax.args[0];
      const url = callArgs[0].url;
      expect(url).to.contain('/api/dashboards/default');
    });

    it('updates the component state', function() {
      expect(component.state.widgets).to.deep.equal([]);

      let successCallback = $.ajax.getCall(0).args[0].success;
      successCallback({widgets: ['hello', 'world']});

      component.retreiveWidgets();

      expect(component.state.widgets).to.deep.equal(['hello', 'world']);
    });

    it('passes retrieveWidgets to the dashboard', function() {
      const dashboard = ReactTestUtils .findRenderedComponentWithType(component, DashboardGrid);
      expect(dashboard.props.refreshDashboard).to.equal(component.retreiveWidgets);
    });
  });
});
