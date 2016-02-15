const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');
const moment = require('moment');
const CiWidget = require('./ci-widget');
const expect = require('chai').expect;

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
    expect(titleNode.textContent).to.equal(widgetProps().title);
  });

  it('renders the time since the last build', function() {
    const titleNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'last-build-at');
    expect(titleNode.textContent).to.equal('a few seconds ago');
  });

  it('renders the delete button', function() {
    expect(TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'delete')).to.exist;
  });

  it('renders the build status', function() {
    expect(TestUtils.findRenderedDOMComponentWithClass(renderWidget(), widgetProps().status).tagName).to.equal('DIV');
  });

  describe('committers name', function() {
    describe('build is building', function() {
      beforeEach(function() {
        status = 'building';
      });

      it('hides the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).to.be.true;
      });
    });

    describe('build is passed', function() {
      beforeEach(function() {
        status = 'passed';
      });

      it('hides the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).to.be.true;
      });
    });

    describe('build is unknown', function() {
      beforeEach(function() {
        status = 'unknown';
      });

      it('hides the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).to.be.true;
      });
    });

    describe('build has failed', function() {
      beforeEach(function() {
        status = 'failed';
      });

      it('shows the committer', function() {
        const committerNode = TestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.textContent).to.equal('by ' + widgetProps().committer);
        expect(committerNode.classList.contains('hidden')).to.be.false;
      });
    });
  });

  it('renders previous build status', function() {
    const nodes = TestUtils.scryRenderedDOMComponentsWithClass(renderWidget(), 'build-block');
    expect(nodes.length).to.equal(4);
  });

  it('renders previous build in reverse order and pads mising builds', function() {
    buildHistory = [
      {state: 'passed'},
      {state: 'unknown'},
      {state: 'failed'}
    ];

    const nodes = TestUtils.scryRenderedDOMComponentsWithClass(renderWidget(), 'build-block');
    expect(nodes.length).to.equal(4);
    expect(nodes[0].className).to.contain('unknown');
    expect(nodes[1].className).to.contain('failed');
    expect(nodes[2].className).to.contain('unknown');
    expect(nodes[3].className).to.contain('passed');
  });
});
