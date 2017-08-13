import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Header } from './layout';
import { Landing, Dashboard } from './pages';
import { SurveyNew } from './surveys';

import { fetchUser } from '../actions';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route exact path="/surveys" component={Dashboard} />
            <Route path="/surveys/new" component={SurveyNew} />
          </div>
        </Router>
      </div>
    );
  }
  
}

export default connect(null, { fetchUser })(App);