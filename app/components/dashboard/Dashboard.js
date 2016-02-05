const React = require('react');
const ReactGridLayout = require('react-grid-layout');
require('./dashboard.scss');

const Dashboard = React.createClass({
  render: function() {
    return (
      <div>
        <ReactGridLayout className="layout" cols={12} rowHeight={30}>
          <div key={1}>1</div>
          <div key={2}>2</div>
          <div key={3}>3</div>
        </ReactGridLayout>
      </div>
    );
  }
});

module.exports = Dashboard;
