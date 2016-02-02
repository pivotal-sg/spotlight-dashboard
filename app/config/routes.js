const React = require('react');
const Main = require('../components/Main');
const Dashboard = require('../components/Dashboard');
const Router = require('react-router');
const Route = Router.Route;
const IndexRoute = Router.IndexRoute;

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Dashboard} />
  </Route>
);
