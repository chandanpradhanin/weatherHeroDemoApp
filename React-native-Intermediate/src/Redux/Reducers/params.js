import * as types from '../Actions/actionTypes';

const params = (state = {languageCode: 'en'}, action) => {
  switch (action.type) {
    case types.SET_LANGUAGE_CODE:
      return {
        ...state,
        languageCode: action.payload.languageCode,
      };
    default:
      return {
        ...state,
        ...(action.payload || {}),
      };
  }
};

export default params;
