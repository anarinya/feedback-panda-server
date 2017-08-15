import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { SurveyField, FIELDS } from './';
import { validateEmails } from '../../utils/';

class SurveyForm extends Component {
  renderFields() {
    return (
      <div>
        { FIELDS.map((field) =>  
          <Field 
            {...field} 
            type="text" 
            key={field.name} 
            component={SurveyField} 
            placeholder={field.placeholder}
          />
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="SurveyForm">
        <form onSubmit={ this.props.handleSubmit(this.props.onSurveySubmit) }>
          { this.renderFields() }
          <button className="btn green lighten-1 white-text" type="submit">
            Build
            <i className="material-icons right">build</i>
          </button>
           
          <Link to="/surveys">
            <button className="btn red lighten-1 white-text">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  // If email input is provided, validate it
  errors.recipients = validateEmails(values.recipients || '');

  // Generate errors for fields that no input was provided for
  FIELDS.forEach(({ name, label }) => {
    if (!values[name]) { 
      errors[name] = `You must provide the ${label.toLowerCase()}.`;
    }
  });

  

  // reduxForm assumes a form is valid if no errors are returned
  return errors;
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  // keep form values when navigating to the review page or pressing 'back' from it
  destroyOnUnmount: false
})(SurveyForm);