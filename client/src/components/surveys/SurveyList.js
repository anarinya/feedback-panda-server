import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderSurveys() {
    // Sort surveys by newest-to-oldest
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card darken-1" key={ survey._id }>
          <div className="card-content">
            <span className="card-title">{ survey.title }</span>
            <p>
              { survey.body }
            </p>
            <p className="right">
              Sent On: { new Date(survey.dateSent).toLocaleDateString() }
            </p>
          </div>
          <div className="card-action">
            <a>Yes: { survey.yes }</a>
            <a>No: { survey.no }</a>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="SurveyList">
        <h1>Survey List</h1>
        { this.renderSurveys() }
      </div>
    );
  }
}

const mapStateToProps = ({ surveys }) => ({ surveys });

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);