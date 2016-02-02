const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router').Router;
const routes = require('./config/routes');

ReactDOM.render(
  <Router>{routes}</Router>,
  document.getElementById('app')
);
