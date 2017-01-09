const React = require('react');
import ReactTestUtils from 'react-addons-test-utils'
const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');
const moment = require('moment');

chai.use(sinonChai);

const CiWidgetContainer = require('./ci-widget-container');
const CiWidget = require('../ci_widget/ci-widget');

describe('CiWidgetContainer', function() {
  const requiredProps = { refreshDashboard: () => {} };
  let fakeTimerTick;
  let fakeFetch;
  let component;

  const widgetProps = {
    title: 'Concierge',
    widgetPath: '/widget_path',
    uuid: 'some uuid'
  };

  beforeEach(function() {
    component = ReactTestUtils .renderIntoDocument(<CiWidgetContainer {...widgetProps} {...requiredProps}/>);
  });

  it('passes its title to the CI widget component', function() {
    const ciWidget = ReactTestUtils .findRenderedComponentWithType(component, CiWidget);
    expect(ciWidget.props.title).to.equal(widgetProps.title);
  });

  it('adds uuid as a data-element on the parent', function() {
    const containerNode = ReactTestUtils .findRenderedDOMComponentWithClass(component, 'ci-widget');
    expect(containerNode.dataset.uuid).to.equal(widgetProps.uuid);
  });

  describe('build information', function() {
    let fakeOnBuildUpdate;
    const res = new window.Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });

    beforeEach( function() {
      fakeOnBuildUpdate = sinon.spy();
      fakeTimerTick = sinon.spy();
      component = ReactTestUtils .renderIntoDocument(
        <CiWidgetContainer {...widgetProps} {...requiredProps}
        onBuildUpdate={fakeOnBuildUpdate}
        timerTick={fakeTimerTick}/>
      );
      fakeFetch = sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.resolve(res));
    });

    afterEach(function() {
      window.fetch.restore();
    });

    it('calls the server to get latest build data', function() {
      component.refreshBuildInfo();

      const callArgs = fakeFetch.args[0];
      const url = callArgs[0];
      const options = callArgs[1];
      expect(url).to.contain('/api/ci_status/' + widgetProps.uuid);
      expect(options.method).to.equal('GET');
    });

    it('calls the onBuildUpdate function upon completing the fetch', function(done) {
      component.refreshBuildInfo();
      done();
      // to make sure that mocha proceeds with success callback.
      expect(fakeOnBuildUpdate.callCount).to.equal(1);
    });
  });

  describe('updateBuildInfo', function() {
    const testBuildInfo = {
      state: 'passed',
      committer: 'Luke Skywalker',
      timestamp: 'A long time ago'
    };

    const olderBuildInfo = {
      state: 'failed',
      committer: 'Anakin Skywalker',
      timestamp: 'A longer time ago'
    };

    const buildInfo = {
      status: {
        build_history: [testBuildInfo, olderBuildInfo]
      }
    };

    it('updates the component state', function() {
      component.onBuildUpdate(buildInfo);
      expect(component.state.status).to.equal(testBuildInfo.state);
      expect(component.state.committer).to.equal(testBuildInfo.committer);
      expect(component.state.lastBuildTime).to.equal(testBuildInfo.timestamp);
      expect(component.state.buildHistory[0]).to.equal(testBuildInfo);
      expect(component.state.buildHistory[1]).to.equal(olderBuildInfo);
      expect(component.state.buildHistory.length).to.equal(2);
    });
  });

  describe('componentDidMount', function() {
    let clock;

    beforeEach(function() {
      fakeTimerTick = sinon.spy();
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it('causes the timerTick to be called at interval', function() {
      const refreshRate = 20000;
      component = ReactTestUtils .renderIntoDocument(
        <CiWidgetContainer {...widgetProps} {...requiredProps} timerTick={fakeTimerTick} refreshInterval={refreshRate}/>
      );

      expect(fakeTimerTick.callCount).to.equal(1);

      clock.tick(refreshRate - 1);
      expect(fakeTimerTick.callCount).to.equal(1);

      clock.tick(2);
      expect(fakeTimerTick.callCount).to.equal(2);
    });
  });

  it('passes the build status from its state to the CI widget component', function() {
    const expectedProps = {status: 'passed', committer: 'committer name', lastBuildTime: 'last build', buildHistory: [{foo: 'bar'}]};
    component.setState(expectedProps);

    const ciWidget = ReactTestUtils .findRenderedComponentWithType(component, CiWidget);
    expect(ciWidget.props).to.contain(expectedProps);
  });
});
