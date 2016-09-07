const React = require('react');
const TestUtils = require('react/lib/ReactTestUtils');

const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const CalendarWidget = require('./calendar-widget');

describe('CalendarWidget', function() {
  let fakeFetch;
  let component;

  const widgetProps = {
    title: 'PL Calendar',
    uuid: 'some_uuid',
  };

  const testEvents = [
    {
      'title': 'event 1 title',
      'start': '2016-02-15T18:30:00.000+08:00',
      'end': '2016-02-15T21:50:00.000+08:00'
    },
    {
      'title': 'event 2 title',
      'start': '2016-02-18T12:00:00.000+08:00',
      'end': '2016-02-18T13:00:00.000+08:00'
    }
  ];

  beforeEach(function() {
    const res = new window.Response(JSON.stringify({events: testEvents}), {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });
    fakeFetch = sinon.stub(window, 'fetch');
    window.fetch.returns(Promise.resolve(res));
  });

  afterEach(function() {
    window.fetch.restore();
  });

  describe('renders the calendar widget', function() {
    beforeEach(function() {
      component = TestUtils.renderIntoDocument( <CalendarWidget {...widgetProps}/>);
    });

    it('renders the events', function(done) {
      setTimeout(function(){
        const body = component.getDOMNode().innerHTML;

        expect(body).to.include(testEvents[0]['title']);
        expect(body).to.include(testEvents[1]['title']);

        done();
      });
    });
  });

  describe('componentDidMount', function() {
    let clock;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    it('calls the server at interval', function() {
      const refreshRate = 1000;

      component = TestUtils.renderIntoDocument(
        <CalendarWidget {...widgetProps} refreshInterval={refreshRate}/>
      );

      expect(fakeFetch.callCount).to.equal(1);

      clock.tick(refreshRate - 1);
      expect(fakeFetch.callCount).to.equal(1);

      clock.tick(2);
      expect(fakeFetch.callCount).to.equal(2);
    });
  });
});
