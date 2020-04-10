/* eslint-disable */
const initialState = {
    otherUserData: undefined
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "OTHER_USER_PROFILE": {
            return { ...state, otherUserData: action.data }
        }
    }
    switch (action.type) {
        case "REMOVE_DATA": {
            return { ...state, otherUserData: undefined }
        }
        default: {
            return state;
        }
    }
}

export default reducer;