// SurveyFormReview shows users their survey details for review
import React from 'react';
import { connect } from 'react-redux';
import { submitSurvey } from '../../actions';
import { FIELDS } from './';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey }) => {
  const reviewFields = FIELDS.map(({ name, label }) => {
    return (
      <div key={ name }>
        <label>{ label }</label>
        <div className="input-value">
          { formValues[name] }
        </div>
      </div>
    );
  });

  return (
    <div className="SurveyFormReview">
      <h5>Please confirm your entries</h5>
      { reviewFields }
      <button className="green lighten-1 btn" onClick={() => submitSurvey(formValues)}>
        Send Survey
        <i className="material-icons right">send</i>
      </button>
      <button className="yellow darken-3 btn" onClick={onCancel}>
        Back
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { formValues: state.form.surveyForm.values };
}

export default connect(mapStateToProps, { submitSurvey })(SurveyFormReview);