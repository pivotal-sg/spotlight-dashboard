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

  describe('when it is available', function() {
    beforeEach( function() {
      const availableResponse = {
        available: true,
        next_available_at: null,
        next_booking_at: '2016-09-07T06:00:00+00:00'
      };
      const res = new window.Response(JSON.stringify(availableResponse), {
        status: 200,
        headers: {
          'Content-type': 'application/json'
        }
      });
      fakeFetch = sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.resolve(res));

      component = ReactTestUtils.renderIntoDocument( <CalendarResourceWidget { ...widgetProps }/>);
    });

    afterEach(function() {
      window.fetch.restore();
    });

    it("shows 'Available'", function(done) {
      setTimeout(function(){
        const body = ReactDOM.findDOMNode(component).innerHTML;
        expect(body).to.include('Available');
        done();
      });
    });
  });

  describe('when it is booked', function() {
    beforeEach( function() {
      const bookedResponse = {
        available: false,
        next_available_at: null,
        next_booking_at: '2016-09-07T06:00:00+00:00'
      };
      const res = new window.Response(JSON.stringify(bookedResponse), {
        status: 200,
        headers: {
          'Content-type': 'application/json'
        }
      });
      fakeFetch = sinon.stub(window, 'fetch');
      window.fetch.returns(Promise.resolve(res));

      component = ReactTestUtils.renderIntoDocument( <CalendarResourceWidget { ...widgetProps }/>);
    });

    afterEach(function() {
      window.fetch.restore();
    });

    it("shows 'Booked'", function(done) {
      setTimeout(function(){
        const body = ReactDOM.findDOMNode(component).innerHTML;
        expect(body).to.include('Booked');
        done();
      });
    });
  });
});

