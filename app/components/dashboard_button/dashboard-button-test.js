const React = require('react');
import ReactTestUtils from 'react-addons-test-utils';
const DashboardButton = require('./dashboard-button');
const expect = require('chai').expect;

describe('DashboardButton', function() {
  const testAction = 'save';
  const testHref = 'some/link';
  const testTooltip = 'tooltip';
  let editOnly = true;

  const testProps = function() {
    return {
      action: testAction,
      href: testHref,
      tooltip: testTooltip,
      editOnly: editOnly
    };
  };

  const renderComponent = function() {
    return ReactTestUtils .renderIntoDocument( <DashboardButton {...testProps()}/>);
  };

  it('renders a link with the action', function() {
    const link = ReactTestUtils .findRenderedDOMComponentWithTag(renderComponent(), 'a');
    expect(link.textContent).to.equal(testAction);
  });

  it('renders a link  with the correct href', function() {
    const link = ReactTestUtils .findRenderedDOMComponentWithTag(renderComponent(), 'a');
    expect(link.href).to.contain(testHref);
  });

  it('adds action details as a class', function() {
    const button = ReactTestUtils .findRenderedDOMComponentWithTag(renderComponent(), 'div');
    expect(button.classList.contains(testAction + '-button')).to.be.true;
  });

  describe('in edit mode', function() {
    beforeEach(function() {
      editOnly = true;
    });

    it('adds edit-only class', function() {
      const button = ReactTestUtils .findRenderedDOMComponentWithTag(renderComponent(), 'div');
      expect(button.classList.contains('edit-only')).to.be.true;
      expect(button.classList.contains('view-only')).to.be.false;
    });
  });

  describe('not in edit mode', function() {
    beforeEach(function() {
      editOnly = false;
    });

    it('adds view-only class', function() {
      const button = ReactTestUtils .findRenderedDOMComponentWithTag(renderComponent(), 'div');
      expect(button.classList.contains('edit-only')).to.be.false;
      expect(button.classList.contains('view-only')).to.be.true;
    });
  });
});
