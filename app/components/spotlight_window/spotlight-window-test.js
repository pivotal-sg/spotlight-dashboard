const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');
const expect = require('chai').expect;
const SpotlightWindow = require('./spotlight-window');
const DashboardGrid = require('../dashboard_grid/dashboard-grid');

describe('SpotlightWindow', function() {
  const testProps = {
    foo: 'bar',
    onSave: 'fakeOnSave'
  };

  it('renders dashboard grid', function() {
    const renderer = TestUtils.createRenderer();
    renderer.render( <SpotlightWindow {...testProps}/>);
    const result = renderer.getRenderOutput();

    const dashboard = result.props.children;
    expect(TestUtils.isElementOfType(dashboard, DashboardGrid)).to.equal(true);
    expect(dashboard.props.foo).to.equal('bar');
    expect(dashboard.props.onSave).to.equal('fakeOnSave');
  });
});
