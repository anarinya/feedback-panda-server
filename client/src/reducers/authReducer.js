import { FETCH_USER } from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_USER:
      // if user isn't logged in, the payload is an empty string
      return action.payload || false;
    default:
      return state;
  }
}