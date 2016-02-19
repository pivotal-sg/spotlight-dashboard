const React = require('react');
const moment = require('moment');
const _ = require('underscore');
const maxCommitterNameLength = 20;

import {apiHost} from '../../config/globals';

require('./ci-widget.scss');

const maxBuildHistory = 5;
const CiWidget = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    widgetPath: React.PropTypes.string.isRequired,
    status: React.PropTypes.oneOf(['passed', 'failed', 'building', 'unknown']).isRequired,
    committer: React.PropTypes.string.isRequired,
    lastBuildTime: React.PropTypes.string.isRequired,
    buildHistory: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      status: 'unknown',
      buildHistory: [ ]
    };
  },

  committerInfo: function() {
    if (this.props.committer) {
      const committerName = this.props.committer;
      const fomattedCommitterName = (committerName.length > maxCommitterNameLength) ?
        (committerName.substring(0, maxCommitterNameLength - 3) + '...') :
        committerName;
      return ('by ' + fomattedCommitterName);
    }
  },

  timeAgo: function(timestamp) {
    return moment(timestamp).fromNow();
  },

  showCommitter: function() {
    return (this.props.status === 'failed' ? '' : 'hidden');
  },

  renderBuildHistory: function() {
    const buildHistory = this.props.buildHistory;
    return _.map(_.range(maxBuildHistory), function(index) {
      const build = buildHistory ? buildHistory[maxBuildHistory - (index + 1)] : null;
      const buildStatus = build ? build.state : 'unknown';
      return ( <div className={'build-block ' + buildStatus }></div>);
    });
  },

  render: function() {
    return (
      <div className={'inner-ci-widget ' + this.props.status}>
        <div className="content">
          <p className="project-name">{this.props.title}</p>
          <div className="commit-info">
            <div className="inner-div">
              <p className="last-build-at">{this.timeAgo(this.props.lastBuildTime)}</p>
              <p className={ 'committer ' + this.showCommitter() }>{this.committerInfo()}</p>
            </div>
          </div>
        </div>
        <div className="build-history">
          {this.renderBuildHistory()}
        </div>
      </div>
    );
  }
});

module.exports = CiWidget;
