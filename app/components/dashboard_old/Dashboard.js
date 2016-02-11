const React = require('react');
let ReactGridLayout = require('react-grid-layout').Responsive;
const widthProvider = require('react-grid-layout').WidthProvider;
ReactGridLayout = widthProvider(ReactGridLayout);

require('./dashboard.scss');

const Dashboard = React.createClass({
  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  },

  render: function() {
    return (
      <div>
        <ReactGridLayout className="layout" cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}} rowHeight={30} isResizable={true}>
          <div key={1} _grid={{x: 0, y: 0, w: 1, h: 2}}>1</div>
          <div key={2} _grid={{x: 1, y: 0, w: 1, h: 2}}>2</div>
          <div key={3} _grid={{x: 2, y: 0, w: 1, h: 2}}>3</div>
        </ReactGridLayout>
      </div>
    );
  }
});

module.exports = Dashboard;
