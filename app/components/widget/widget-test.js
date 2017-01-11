const React = require('react');
import ReactTestUtils from 'react-addons-test-utils'
const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const Widget = require('./widget');
const ClockWidget = require('../clock_widget/clock-widget');
const CiWidgetContainer = require('../ci_widget_container/ci-widget-container');
const CalendarWidget = require('../calendar_widget/calendar-widget');

describe('Widget', function() {
  let component;
  const requiredProps = {
    refreshDashboard: () => {}
  };

  const widgetProps = {
    title: 'Concierge',
    widgetPath: '/widget_path',
    uuid: 'some uuid',
    category: 'clock_widget'
  };

  beforeEach(function() {
    component = ReactTestUtils .renderIntoDocument(<Widget {...widgetProps} {...requiredProps}/>);
  });

  it('passes its props to the child component', function() {
    const clock = ReactTestUtils .findRenderedComponentWithType(component, ClockWidget);
    expect(clock.props).to.contain(widgetProps);
  });

  it('renders the delete button', function() {
    expect(ReactTestUtils.findRenderedDOMComponentWithClass(component, 'delete')).to.exist;
  });

  describe('deleteWidget', function() {
    let fakeRefreshDashboard;
    let fakeFetch;
    const res = new window.Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });

    beforeEach(function() {
      fakeRefreshDashboard = sinon.spy();
      component = ReactTestUtils .renderIntoDocument(
        <Widget {...widgetProps}
        refreshDashboard={fakeRefreshDashboard}/>
      );
      fakeFetch = sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.resolve(res));
    });

    afterEach(function() {
      window.fetch.restore();
    });

    it('makes a delete call to the API', function() {
      component.deleteWidget();
      const callArgs = fakeFetch.args[0];
      const url = callArgs[0];
      const options = callArgs[1];
      expect(url).to.contain(widgetProps.widgetPath);
      expect(options.method).to.equal('delete');
    });

    it('calls refresh widgets function on success', function(done) {
      expect(fakeRefreshDashboard.callCount).to.equal(0);
      component.deleteWidget();
      done();
      expect(fakeRefreshDashboard.callCount).to.equal(1);
    });
  });

  describe('widget Category', function() {
    const propsWithoutCategory = {
      title: 'Concierge',
      widgetPath: '/widget_path',
      uuid: 'some uuid',
    };

    describe('is clock', function() {
      it('renders a clock widget', function() {
        const widget = ReactTestUtils.renderIntoDocument(<Widget {...propsWithoutCategory} category="clock_widget" {...requiredProps}/>);
        expect(ReactTestUtils.findRenderedComponentWithType(widget, ClockWidget)).to.exist;
      });
    });
    describe('is ci', function() {
      it('renders a ci widget', function() {
        const widget = ReactTestUtils.renderIntoDocument(<Widget {...propsWithoutCategory} category="ci_widget" {...requiredProps}/>);
        expect(ReactTestUtils.findRenderedComponentWithType(widget, CiWidgetContainer)).to.exist;
      });
    });
    describe('is gcal', function() {
      it('renders a calendar widget', function() {
        const widget = ReactTestUtils.renderIntoDocument(<Widget {...propsWithoutCategory} category="gcal_widget" {...requiredProps}/>);
        expect(ReactTestUtils.findRenderedComponentWithType(widget, CalendarWidget)).to.exist;
      });
    });
  });
});
