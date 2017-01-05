const React = require('react');
import ReactTestUtils from 'react-addons-test-utils'
const moment = require('moment');
const CiWidget = require('./ci-widget');
const expect = require('chai').expect;

describe('CiWidget', function() {
  let status = 'building';
  let buildHistory = [ {state: 'passed'} ];
  let committerName = 'committer name';

  const widgetProps = function() {
    return {
      title: 'Concierge',
      widgetPath: '/widget_path',
      status: status,
      committer: committerName,
      lastBuildTime: moment().format(),
      buildHistory: buildHistory
    };
  };

  const renderWidget = function() {
    return ReactTestUtils.renderIntoDocument(<CiWidget {...widgetProps()}/>);
  };

  it('renders the title', function() {
    const titleNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'project-name');
    expect(titleNode.textContent).to.equal(widgetProps().title);
  });

  it('renders the time since the last build', function() {
    const titleNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'last-build-at');
    expect(titleNode.textContent).to.equal('a few seconds ago');
  });

  it('renders the build status', function() {
    expect(ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), widgetProps().status).tagName).to.equal('DIV');
  });

  describe('committers name', function() {
    describe('build is building', function() {
      beforeEach(function() {
        status = 'building';
      });

      it('hides the committer', function() {
        const committerNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).to.be.true;
      });
    });

    describe('build is passed', function() {
      beforeEach(function() {
        status = 'passed';
      });

      it('hides the committer', function() {
        const committerNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).to.be.true;
      });
    });

    describe('build is unknown', function() {
      beforeEach(function() {
        status = 'unknown';
      });

      it('hides the committer', function() {
        const committerNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.classList.contains('hidden')).to.be.true;
      });
    });

    describe('build has failed', function() {
      beforeEach(function() {
        status = 'failed';
      });

      it('shows the committer', function() {
        const committerNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.textContent).to.equal(widgetProps().committer);
        expect(committerNode.classList.contains('hidden')).to.be.false;
      });

      it('replaces the + in committer names with &', function() {
        committerName = 'person1 + person 2';
        const committerNode = ReactTestUtils.findRenderedDOMComponentWithClass(renderWidget(), 'committer');
        expect(committerNode.textContent).to.equal('person1 & person 2');
      });
    });
  });

  it('renders previous build status', function() {
    const nodes = ReactTestUtils.scryRenderedDOMComponentsWithClass(renderWidget(), 'build-block');
    expect(nodes.length).to.equal(5);
  });

  it('renders previous build in reverse order and pads mising builds', function() {
    buildHistory = [
      {state: 'passed'},
      {state: 'unknown'},
      {state: 'failed'}
    ];

    const nodes = ReactTestUtils.scryRenderedDOMComponentsWithClass(renderWidget(), 'build-block');
    expect(nodes.length).to.equal(5);
    expect(nodes[0].className).to.contain('unknown');
    expect(nodes[1].className).to.contain('unknown');
    expect(nodes[2].className).to.contain('failed');
    expect(nodes[3].className).to.contain('unknown');
    expect(nodes[4].className).to.contain('passed');
  });
});
