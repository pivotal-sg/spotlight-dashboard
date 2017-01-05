const React = require('react');
const $ = require('jquery');
import ReactTestUtils from 'react-addons-test-utils'
const expect = require('chai').expect;
const SpotlightWindow = require('./spotlight-window');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');

describe('SpotlightWindow', function() {
  const testProps = {
    foo: 'bar',
    onSave: 'fakeOnSave'
  };

  beforeEach(function() {
    sinon.stub($, 'get');
  });

  afterEach(function() {
    $.get.restore();
  });

  it('renders dashboard grid', function() {
    const renderer = ReactTestUtils.createRenderer();
    renderer.render( <SpotlightWindow {...testProps}/>);
    const result = renderer.getRenderOutput();

    const dashboard = result.props.children;
    expect(ReactTestUtils.isElementOfType(dashboard, DashboardGrid)).to.equal(true);
    expect(dashboard.props.foo).to.equal('bar');
    expect(dashboard.props.onSave).to.equal('fakeOnSave');
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

  describe('retreiveWidgets', function() {
    let component;

    beforeEach(function() {
      component = ReactTestUtils .renderIntoDocument(<SpotlightWindow {...testProps}/>);
    });

    it('retreives all widgets', function() {
      component.retreiveWidgets();

      const callArgs = $.get.args[0];
      const url = callArgs[0];
      expect(url).to.contain('/api/dashboards/default');
    });

    it('updates the component state', function() {
      expect(component.state.widgets).to.deep.equal([]);
      $.get.yields({widgets: ['hello', 'world']});

      component.retreiveWidgets();

      expect(component.state.widgets).to.deep.equal(['hello', 'world']);
    });

    it('passes retrieveWidgets to the dashboard', function() {
      const dashboard = ReactTestUtils .findRenderedComponentWithType(component, DashboardGrid);
      expect(dashboard.props.refreshDashboard).to.equal(component.retreiveWidgets);
    });
  });
});
