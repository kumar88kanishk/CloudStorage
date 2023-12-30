import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customization.reducer';
import userReducer from './user.reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    user: userReducer,
});

export default reducer;
