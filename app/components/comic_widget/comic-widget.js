const React = require('react');
const moment = require('moment');

require('./comic-widget.scss');
import {apiHost} from '../../config/globals';

const ComicWidget = React.createClass({
  getInitialState: function() {
    return {
        imgUrl: '',
        imgTitle: 'Comic Loading....'
    };
  },

  componentDidMount: function() {
    this.updateComic();
    const timerIntervalId = setInterval(this.updateComic, 5 * 60 * 1000);
    this.setState({timerId: timerIntervalId});
  },

  componentWillUnmount: function() {
    clearInterval(this.state.timerId);
  },

  updateComic: function() {
    const component = this;
    const comicApiUrl = apiHost + '/api/random_comic';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    };
    fetch(comicApiUrl, options)
    .then(function(response) {
      return response.json();
    }).then( function(json) {
      component.setState({
        imgUrl: json.img_url,
        imgTitle: json.img_title
      });
    });
  },

  render: function() {
    const comicStyles =  {
      backgroundImage: 'url(' + this.state.imgUrl + ')'
    };
    return (
      <div className="comic">
        <div className="comic-title">{this.state.imgTitle}</div>
        <div className="comic-img-container">
          <div className="comic-img" style={comicStyles}></div>
        </div>
      </div>
    );
  }
});

module.exports = ComicWidget;
