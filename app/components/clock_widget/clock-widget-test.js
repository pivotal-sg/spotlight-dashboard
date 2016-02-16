const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');
const moment = require('moment');

const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const ClockWidget = require('./clock-widget');

describe('ClockWidget', function() {
  let component;
  let clock;

  beforeEach(function() {
    clock = sinon.useFakeTimers();
    component = TestUtils.renderIntoDocument(<ClockWidget title="Singapore Clock"/>);
  });

  afterEach(function() {
    clock.restore();
  });

  it('renders the time', function() {
    const time = TestUtils.findRenderedDOMComponentWithClass(component, 'time');
    expect(time).to.exist;
    expect(time.textContent).to.contain(moment().format('H:mm:ss'));
  });

  it('renders the date', function() {
    const date = TestUtils.findRenderedDOMComponentWithClass(component, 'date');
    expect(date).to.exist;
    expect(date.textContent).to.contain(moment().format('dddd, DD MMM'));
  });

  it('updates the time', function() {
    const time = TestUtils.findRenderedDOMComponentWithClass(component, 'time');
    expect(time.textContent).to.contain(moment().format('H:mm:ss'));
    clock.tick(50000);
    expect(time.textContent).to.contain(moment().format('H:mm:ss'));
  });
});
