import * as React from "react";
import {apiHost} from '../../config/globals';

require('./openair-widget.scss');

const defaultProps = {
  refreshInterval: 5 * 60 * 1000
};

export default class OpenairWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {status: "loading"};
  }

  componentDidMount() {
    this.updateSubmissionStatus();
    const timerId = setInterval(this.updateSubmissionStatus.bind(this), this.props.refreshInterval);
    this.setState({timerId: timerId});
  }

  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }

  updateSubmissionStatus() {
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Spotlight-Token': localStorage.getItem('authToken')
      }
    };

    fetch(apiHost + "/api/openair/" + this.props.uuid, options)
      .then((res) => {
        console.log(res);
        return res.json();
      }).then((json) => {
        console.log(json);
        this.setState({status: json.status});
    });
  }

  render() {
    return (
      <div className={'openair-timesheet-status ' + this.state.status} data-uuid={this.props.uuid}>
        <div className="title">{this.props.title}</div>
        <div className="sign status">{ this.state.status }</div>

      </div>
    )
  }
}

OpenairWidget.defaultProps = defaultProps;
