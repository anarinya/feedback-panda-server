// SurveyField contains logic to render a single label & text input
import React from 'react';

export default ({ input, label, placeholder, meta: { error, touched } }) => {
  return (
    <div className="SurveyField">
      <label>{ label }</label>
      <input { ...input } placeholder={placeholder} />
      <div className="red-text error-message">
        { touched && error }
      </div>
    </div>
  );
};