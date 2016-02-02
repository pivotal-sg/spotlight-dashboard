const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
import createBrowserHistory from 'history/lib/createBrowserHistory';

const routes = require('./config/routes');

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    {routes}
  </Router>,
  document.getElementById('app')
);
