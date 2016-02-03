const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');
const expect = require('expect');
const moment = require('moment');
const CiWidget = require('./ci-widget');

describe('CiWidget', function() {
  let status = 'building';
  let buildHistory = [ {state: 'passed'} ];

  const widgetProps = function() {
    return {
      title: 'Concierge',
      widgetPath: '/widget_path',
      status: status,
      committer: 'committer name',
      lastBuildTime: moment().format(),
      buildHistory: buildHistory
    };
  };

  const renderWidget = function() {
    return TestUtils.renderIntoDocument(<CiWidget {...widgetProps()}/>);
  };

  it('renders the title', function() {
    const titleNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'project-name');
    expect(titleNode.textContent).toEqual(widgetProps().title);
  });

  it('renders the time since the last build', function() {
    const titleNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'last-build-at');
    expect(titleNode.textContent).toEqual('a few seconds ago');
  });

  it('renders the delete button', function() {
    const deleteLink = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'delete');
    expect(deleteLink.href).toContain(widgetProps().widgetPath);
  });

  it('renders the build status', function() {
    expect(TestUtils.findRenderedDOMComponentWithClass(renderWidget(), widgetProps().status).tagName).toEqual('DIV');
  });

  describe('committers name', function() {
    describe('build is building', function() {
      beforeEach(function() {
        status = 'building';
      });

      it('hides the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).toBe(true);
      });
    });

    describe('build is passed', function() {
      beforeEach(function() {
        status = 'passed';
      });

      it('hides the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).toBe(true);
      });
    });

    describe('build is unknown', function() {
      beforeEach(function() {
        status = 'unknown';
      });

      it('hides the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).toBe(true);
      });
    });

    describe('build has failed', function() {
      beforeEach(function() {
        status = 'failed';
      });

      it('shows the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.textContent).toEqual('by ' + widgetProps().committer);
        expect(committerNode.classList.contains('hidden')).toBe(false);
      });
    });
  });

  it('renders previous build status', function() {
    const nodes = TestUtils.scryRenderedDOMComponentsWithClass(renderWidget(), 'build-block');
    expect(nodes.length).toEqual(4);
  });

  it('renders previous build in reverse order and pads mising builds', function() {
    buildHistory = [
      {state: 'passed'},
      {state: 'unknown'},
      {state: 'failed'}
    ];

    const nodes = TestUtils.scryRenderedDOMComponentsWithClass(renderWidget(), 'build-block');
    expect(nodes.length).toEqual(4);
    expect(nodes[0].className).toContain('unknown');
    expect(nodes[1].className).toContain('failed');
    expect(nodes[2].className).toContain('unknown');
    expect(nodes[3].className).toContain('passed');
  });
});
