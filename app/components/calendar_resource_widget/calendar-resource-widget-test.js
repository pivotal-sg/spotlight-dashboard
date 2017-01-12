const React = require('react');
import ReactTestUtils from 'react-addons-test-utils'
import ReactDOM from "react-dom";

const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const CalendarResourceWidget = require('./calendar-resource-widget');

describe('CalendarResourceWidget', function() {
  let fakeFetch;
  let component;

  const widgetProps = {
    title: 'PL Calendar',
    uuid: 'some_uuid',
  };

  function setup(response) {
    const res = new window.Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });

    fakeFetch = sinon.stub(window, 'fetch');
    window.fetch.returns(Promise.resolve(res));

    component = ReactTestUtils.renderIntoDocument(<CalendarResourceWidget { ...widgetProps }/>);
  }

  afterEach(function() {
    window.fetch.restore();
  });

  describe('when it is available', function() {
    const availableResponse = {
      available: true,
      next_available_at: null,
      next_booking_at: '2016-09-07T06:00:00+00:00'
    };

    it("shows 'Available'", function(done) {
      setup(availableResponse);

      setTimeout(function() {
        const body = ReactDOM.findDOMNode(component).innerHTML;
        expect(body).to.include('Available');
        done();
      }, 300);
    });

    describe('when there are no upcoming bookings', function() {
      const availableResponse = {
        available: true,
        next_available_at: null,
        next_booking_at: null
      };

      it("shows 'No upcoming bookings'", function(done) {
        setup(availableResponse);

        setTimeout(function() {
          const body = ReactDOM.findDOMNode(component).innerHTML;
          expect(body).to.include('Available');
          expect(body).to.include('No upcoming bookings');
          done();
        }, 300);
      });
    });
  });

  describe('when it is booked', function() {
    const bookedResponse = {
      available: false,
      next_available_at: '2016-09-07T06:00:00+00:00',
      next_booking_at: null
    };

    it("shows 'Booked'", function(done) {
      setup(bookedResponse);

      setTimeout(function(){
        const body = ReactDOM.findDOMNode(component).innerHTML;
        expect(body).to.include('Booked');
        done();
      }, 300);
    });
  });
});

