const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');

const _ = require('underscore');

const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const DashboardGrid = require('./dashboard-grid');
const ReactGridLayout = require('react-grid-layout');
const Widget = require('../widget/widget');

describe('DashboardGrid', function() {
  let dashboard;
  const testTitle = 'Concierge';
  const testUuid = '123456789';
  const testPath = '/widget_path';
  const rowHeight = 100;
  const testLayout = {
    x: 3,
    y: 0,
    h: 2,
    w: 6
  };
  const testCategory = 'ci_widget';

  let widgetProps = {
    uuid: testUuid,
    title: testTitle,
    layout: testLayout,
    widgetPath: testPath,
    category: testCategory
  };
  const fakeWindowRedirect = sinon.spy();
  const fakeRefreshDashboard = sinon.spy();
  let fakeFetch;
  const fetchResponse = new window.Response('{"hello":"world"}', {
    status: 200,
    headers: {
      'Content-type': 'application/json'
    }
  });

  beforeEach(function() {
    dashboard = TestUtils.renderIntoDocument(
      <DashboardGrid widgets={[widgetProps]}
      dashboardId={1}
      editMode={false}
      onSave={fakeWindowRedirect}
      refreshDashboard={fakeRefreshDashboard}
      />
    );
    fakeFetch = sinon.stub(window, 'fetch');
    window.fetch.returns(Promise.resolve(fetchResponse));
  });

  afterEach(function() {
    window.fetch.restore();
  });

  it('renders the widget', function() {
    const titleNode = TestUtils.findRenderedDOMComponentWithClass(dashboard, 'project-name');
    expect(titleNode.textContent).to.equal(testTitle);
  });


  it('passes all the props', function() {
    const widgetContainer = TestUtils.findRenderedComponentWithType(dashboard, Widget);
    expect(widgetContainer.props.uuid).to.equal(testUuid);
    expect(widgetContainer.props.title).to.equal(testTitle);
    expect(widgetContainer.props.layout).to.equal(testLayout);
    expect(widgetContainer.props.widgetPath).to.equal(testPath);
    expect(widgetContainer.props.refreshDashboard).to.equal(fakeRefreshDashboard);
  });

  it('renders the widget with correct height', function() {
    const widgetHeight = parseInt(TestUtils.findRenderedDOMComponentWithClass(dashboard, 'react-grid-item').style.height.replace('px', ''), 10);
    const delta = 15;
    expect(widgetHeight).to.be.greaterThan((rowHeight * 2) - delta);
    expect(widgetHeight).to.be.lessThan((rowHeight * 2) + delta);
  });

  it('renders the widget with correct width', function() {
    const widgetWidth = parseInt(TestUtils.findRenderedDOMComponentWithClass(dashboard, 'react-grid-item').style.width.replace('%', ''), 10);
    const delta = 3;
    expect(widgetWidth).to.be.greaterThan(50 - delta); // Note: 50% - 6 of 12 columns
    expect(widgetWidth).to.be.lessThan(50 + delta);
  });

  describe('not in edit mode', function() {
    beforeEach(function() {
      dashboard = TestUtils.renderIntoDocument(<DashboardGrid widgets={[widgetProps]} dashboardId="1" editMode={false}/>);
    });

    it('does not allow dragging', function() {
      const reactGridLayout = TestUtils.findRenderedComponentWithType(dashboard, ReactGridLayout);
      expect(reactGridLayout.props.isDraggable).to.equal(false);
    });

    it('does not allow resizing', function() {
      const reactGridLayout = TestUtils.findRenderedComponentWithType(dashboard, ReactGridLayout);
      expect(reactGridLayout.props.isResizable).to.equal(false);
    });
  });

  describe('in edit mode', function() {
    beforeEach(function() {
      dashboard = TestUtils.renderIntoDocument(<DashboardGrid widgets={[widgetProps]} dashboardId="1" editMode={true}/>);
    });

    it('allows dragging', function() {
      const reactGridLayout = TestUtils.findRenderedComponentWithType(dashboard, ReactGridLayout);
      expect(reactGridLayout.props.isDraggable).to.equal(true);
    });

    it('allows resizing', function() {
      const reactGridLayout = TestUtils.findRenderedComponentWithType(dashboard, ReactGridLayout);
      expect(reactGridLayout.props.isResizable).to.equal(true);
    });
  });

  describe('update layout', function() {
    it('initialized the current layout with widget layout', function() {
      const expectedLayout = _.extend(testLayout, {'i': testUuid});
      const widgetLayout = dashboard.state.currentLayout[0];
      expect(widgetLayout.x).to.equal(expectedLayout.x);
      expect(widgetLayout.y).to.equal(expectedLayout.y);
      expect(widgetLayout.h).to.equal(expectedLayout.h);
      expect(widgetLayout.w).to.equal(expectedLayout.w);
      expect(widgetLayout.i).to.equal(expectedLayout.i);
      expect(dashboard.state.currentLayout.length).to.equal(1);
    });

    it('saves the provided layout as current layout', function() {
      const newLayout = 'new Layout';
      dashboard.updateLayout(newLayout);
      expect(dashboard.state.currentLayout).to.equal(newLayout);
    });
  });

  describe('persist layout', function() {
    const doPersist = function() { dashboard.persistLayout(); };

    it('sends the current layout to the server', function(done) {
      dashboard.state.currentLayout = 'new Layout';
      doPersist();
      done();

      const callArgs = fakeFetch.args[0];
      const url = callArgs[0];
      const options = callArgs[1];
      expect(url).to.be('/api/dashboards/1/layout');
      expect(options.method).to.be('PUT');
      expect(options.data()).to.equal({layout: 'new Layout'});
    });

    it('calls the onSave function when layout is saved', function(done) {
      doPersist();
      done();
      expect(fakeWindowRedirect.callCount).to.be(1);
    });
  });
});
