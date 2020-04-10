/* eslint-disable */

import { combineReducers } from 'redux'
import auth from './reducers/authReducer'
import chart from './reducers/chartReducer'
import font from './reducers/fontReducer'
import profile from './reducers/profileReducer'

export default combineReducers({
    auth,
    chart,
    profile,
    font,
})
