const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');
const expect = require('expect');
const Dashboard = require('./dashboard');

describe('Dashboard', function() {
  it('can render the dashboard', function() {
    const rendered = TestUtils.renderIntoDocument(<Dashboard/>);
    expect(rendered).toExist();
  });
});
