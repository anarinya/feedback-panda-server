import React from 'react';
import { Link } from 'react-router-dom';
import { SurveyList } from '../surveys';

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <div className="container">
        <SurveyList />
        <div className="fixed-action-btn">
          <Link to="/surveys/new" className="btn-floating btn-large blue">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;