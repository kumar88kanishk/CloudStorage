import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customization.reducer';
import userReducer from './user.reducer';
import objectReducer from './object.reducer';
import trashReducer from './trash.reducer';
import dashboardReducer from './dashboard.reducer';
import uploadReducer from './upload.reducer';
import browserReducer from './browser.reducer';
import recentReducer from './recent.reducer';
import starredReducer from './starred.reducer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    user: userReducer,
    objects: objectReducer,
    trash: trashReducer,
    dashboard: dashboardReducer,
    upload: uploadReducer,
    browser: browserReducer,
    recent: recentReducer,
    starred: starredReducer,
});

export default reducer;
