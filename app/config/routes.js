const React = require('react');
const Main = require('../components/main/Main');
const Dashboard = require('../components/dashboard/Dashboard');
const Router = require('react-router');
const Route = Router.Route;
const IndexRoute = Router.IndexRoute;

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Dashboard} />
  </Route>
);
