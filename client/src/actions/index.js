import axios from 'axios';
import { FETCH_USER, SUBMIT_SURVEY } from './types';

export const fetchUser = () => async dispatch => {
  try {
    const response = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch(e) {
    console.error(`Error fetching user: ${e}`);
  }
};

export const handleToken = token => async dispatch => {
  try {
    const response = await axios.post('/api/checkout', token);
    dispatch({ type: FETCH_USER, payload: response.data });
  } catch(e) {
    console.error(`Error handling token: ${e}`);
  }
};

export const submitSurvey = (values, history) => async dispatch => {
  try {
    const response = await axios.post('/api/surveys', values);
    history.push('/surveys');
    
    dispatch({ type: FETCH_USER, payload: response.data});
  }
  catch(e) {
    console.error(`Error submitting survey: ${e}`);
  }
};