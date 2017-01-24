import * as React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import OpenairWidget from './openair-widget';

describe('OpenairWidget', () => {
  let fakeFetch;
  let component;

  const widgetProps = {
    title: "OpenAir Title",
    uuid: 'widget-uuid'
  };

  function within(milliseconds, test) {
    setTimeout(test, milliseconds);
  }

  function respondWith(response, mockedFetch = fakeFetch) {
    const res = new window.Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-type': 'application/json'
      }
    });

    mockedFetch.returns(Promise.resolve(res));
  }

  describe('feature', () => {
    beforeEach(() => {
      fakeFetch = sinon.stub(window, 'fetch');
      respondWith({status: 'submitted'});
      component = ReactTestUtils.renderIntoDocument(<OpenairWidget {...widgetProps}/>);
    });

    afterEach(() => {
      window.fetch.restore();
    });

    it('displays the widget title', () => {
      const title = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'title');
      expect(title.textContent).to.eq("OpenAir Title")
    });

    it('initially displays loading as the submission status', () => {
      const status = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'status');
      expect(status.textContent).to.eq('loading');
    });

    it('updates the submission status when component is mounted', (done) => {
      respondWith({status: 'submitted'});
      component = ReactTestUtils.renderIntoDocument(<OpenairWidget {...widgetProps}/>);

      within(300, () => {
        const status = ReactTestUtils.findRenderedDOMComponentWithClass(component, 'status');
        expect(status.textContent).to.eq('submitted');
        done();
      });
    });
  });

  describe('componentDidMount', function() {
    let fakeFetch;
    let clock;
    let renderedComponent;
    const refreshRate = 100;

    beforeEach(function() {
      fakeFetch = sinon.stub(window, 'fetch');
      respondWith({status: 'submitted'}, fakeFetch);

      clock = sinon.useFakeTimers();

      renderedComponent = ReactTestUtils.renderIntoDocument(<OpenairWidget {...widgetProps} refreshInterval={refreshRate}/>);
    });

    afterEach(function() {
      clock.restore();
      fakeFetch.restore();
    });

    it('calls the server at interval', function() {
      expect(fakeFetch.callCount).to.equal(1);

      clock.tick(refreshRate - 1);
      expect(fakeFetch.callCount).to.equal(1);

      clock.tick(2);
      expect(fakeFetch.callCount).to.equal(2);
    });
  });
});
