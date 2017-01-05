const React = require('react');
import ReactTestUtils from 'react-addons-test-utils'const expect = require('chai').expect;
const SpotlightWindow = require('./spotlight-window');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');

describe('SpotlightWindow', function() {
  const testProps = {
    foo: 'bar',
    onSave: 'fakeOnSave'
  };

  it('renders dashboard grid', function() {
    const renderer = ReactTestUtils .createRenderer();
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
    let fakeFetch;
    let component;
    const res = new window.Response(
      JSON.stringify({widgets: ['hello', 'world']}),
      {
        status: 200,
        headers: {
          'Content-type': 'application/json'
        }
      }
    );

    beforeEach(function() {
      component = ReactTestUtils .renderIntoDocument(<SpotlightWindow {...testProps}/>);
      fakeFetch = sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.resolve(res));
    });

    afterEach(function() {
      window.fetch.restore();
    });

    it('retreives all widgets', function() {
      component.retreiveWidgets();

      const callArgs = fakeFetch.args[0];
      const url = callArgs[0];
      expect(url).to.contain('/api/dashboards/default');
    });

    it('updates the component state', function(done) {
      component.retreiveWidgets();
      done();
      expect(component.state.widgets).to.equal(['hello', 'world']);
    });

    it('passes retrieveWidgets to the dashboard', function() {
      const dashboard = ReactTestUtils .findRenderedComponentWithType(component, DashboardGrid);
      expect(dashboard.props.refreshDashboard).to.equal(component.retreiveWidgets);
    });
  });
});
