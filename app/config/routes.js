const React = require('react');
const Main = require('../components/main/Main');
const SpotlightWindow = require('../components/spotlight_window/spotlight-window');
const Router = require('react-router');
const Route = Router.Route;
const IndexRoute = Router.IndexRoute;

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={SpotlightWindow} />
  </Route>
);
