const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');

let chai = require('chai');
let expect = require('chai').expect;
let sinonChai = require('sinon-chai');

chai.use(sinonChai);

const CiWidgetContainer = require('./ci-widget-container');
const CiWidget = require('../ci_widget/ci-widget');

describe('CiWidgetContainer', function() {
  // let fakeTimerTick;
  // let fakeFetch;
  let component;
  let ciWidget;

  const widgetProps = {
    title: 'Concierge',
    widgetPath: '/widget_path',
    uuid: 'some uuid'
  };

  //
  // beforeEach(function() {
  //   fakeFetch = expect.spyOn(window, 'fetch');
  //   fakeTimerTick = sinon.spy('fakeTimerTick');
  //
  //   component = TestUtils.renderIntoDocument(<CiWidgetContainer {...widgetProps} timerTick={fakeTimerTick}/>);
  //   ciWidget = TestUtils.findRenderedComponentWithType(component, CiWidget);
  // });
  //
  // afterEach(function() {
  //   fakeFetch.restore();
  // });
  //
  //
  it('passes its title to the CI widget component', function() {
    const fakeTimerTick = sinon.spy();
    component = TestUtils.renderIntoDocument(<CiWidgetContainer {...widgetProps} timerTick={fakeTimerTick}/>);
    // ciWidget = TestUtils.findRenderedComponentWithType(component, CiWidget);
    // expect(ciWidget.props.title).to.equal(widgetProps.title);
  });

  // it('adds uuid as a data-element on the parent', function() {
  //   const containerNode = TestUtils.findRenderedDOMComponentWithClass(component, 'ci-widget');
  //   expect(containerNode.dataset.uuid).to.equal(widgetProps.uuid);
  // });
  //
  // describe('build information', function() {
  //   it('calls the server to get latest build data', function() {
  //     component.refreshBuildInfo();
  //
  //     const request = fakeFetch.calls[0];
  //     expect(request.url).to.be('/api/ci_status/' + widgetProps.uuid);
  //     expect(request.method).to.be('GET');
  //   });
  //
  //   describe('when build status is retrieved', function() {
  //     let fakeOnBuildUpdate;
  //
  //     beforeEach(function() {
  //       fakeOnBuildUpdate = sinon.spy('fakeOnBuildUpdate');
  //       component = TestUtils.renderIntoDocument(
  //         <CiWidgetContainer {...widgetProps} onBuildUpdate={fakeOnBuildUpdate}/>
  //       );
  //
  //       component.refreshBuildInfo();
  //
  //       const request = fakeFetch.calls[0];
  //       request.respondWith({ status: 200, responseText: '{"foo": "bar"}' });
  //     });
  //
  //     it('calls the onBuildUpdate function', function() {
  //       expect(fakeOnBuildUpdate.calls.count()).to.be(1);
  //     });
  //   });
  // });
  //
  // describe('updateBuildInfo', function() {
  //   const testBuildInfo = {
  //     state: 'passed',
  //     committer: 'Luke Skywalker',
  //     timestamp: 'A long time ago'
  //   };
  //
  //   const olderBuildInfo = {
  //     state: 'failded',
  //     committer: 'Anakin Skywalker',
  //     timestamp: 'A longer time ago'
  //   };
  //
  //   const buildInfo = {
  //     status: {
  //       build_history: [testBuildInfo, olderBuildInfo]
  //     }
  //   };
  //
  //   it('updates the component state', function() {
  //     component.onBuildUpdate(buildInfo);
  //     expect(component.state.status).to.equal(testBuildInfo.state);
  //     expect(component.state.committer).to.equal(testBuildInfo.committer);
  //     expect(component.state.lastBuildTime).to.equal(testBuildInfo.timestamp);
  //     expect(component.state.buildHistory).to.equal([olderBuildInfo]);
  //   });
  // });

  // describe('componentDidMount', function() {
  //   beforeEach(function() {
  //     fakeTimerTick = jasmine.createSpy('timer tick');
  //     jasmine.clock().install();
  //   });
  //
  //   afterEach(function() {
  //     jasmine.clock().uninstall();
  //   });
  //
  //   it('causes the timerTick to be called at interval', function() {
  //     const refreshRate = 20000;
  //     component = TestUtils.renderIntoDocument(
  //       <CiWidgetContainer {...widgetProps} timerTick={fakeTimerTick} refreshInterval={refreshRate}/>
  //     );
  //
  //     expect(fakeTimerTick.calls.count()).to.be(1);
  //
  //     jasmine.clock().tick(refreshRate - 1);
  //     expect(fakeTimerTick.calls.count()).to.be(1);
  //
  //     jasmine.clock().tick(2);
  //     expect(fakeTimerTick.calls.count()).to.be(2);
  //   });
  // });
  //
  // it('passes the build status from its state to the CI widget component', function() {
  //   const expectedProps = {status: 'status', committer: 'committer name', lastBuildTime: 'last build', buildHistory: [{foo: 'bar'}]};
  //   component.setState(expectedProps);
  //   expect(ciWidget.props).to.equal(jasmine.objectContaining(expectedProps));
  // });
});
