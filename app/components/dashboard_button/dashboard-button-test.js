const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');
const expect = require('expect');
const DashboardButton = require('./dashboard-button');

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
    return TestUtils.renderIntoDocument( <DashboardButton {...testProps()}/>);
  };

  it('renders a link with the action', function() {
    const link = TestUtils.findRenderedDOMComponentWithTag(renderComponent(), 'a');
    expect(link.textContent).toEqual(testAction);
  });

  it('renders a link  with the correct href', function() {
    const link = TestUtils.findRenderedDOMComponentWithTag(renderComponent(), 'a');
    expect(link.href).toContain(testHref);
  });

  it('adds action details as a class', function() {
    const button = TestUtils.findRenderedDOMComponentWithTag(renderComponent(), 'div');
    expect(button.classList.contains(testAction + '-button')).toBe(true);
  });

  describe('in edit mode', function() {
    beforeEach(function() {
      editOnly = true;
    });

    it('adds edit-only class', function() {
      const button = TestUtils.findRenderedDOMComponentWithTag(renderComponent(), 'div');
      expect(button.classList.contains('edit-only')).toBe(true);
      expect(button.classList.contains('view-only')).toBe(false);
    });
  });

  describe('not in edit mode', function() {
    beforeEach(function() {
      editOnly = false;
    });

    it('adds view-only class', function() {
      const button = TestUtils.findRenderedDOMComponentWithTag(renderComponent(), 'div');
      expect(button.classList.contains('edit-only')).toBe(false);
      expect(button.classList.contains('view-only')).toBe(true);
    });
  });
});
