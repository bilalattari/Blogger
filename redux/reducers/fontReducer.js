/* eslint-disable */
const initialState = {
    fontFamily : "DancingScript-Bold"
  }
  
  const reducer = (state = initialState, action) =>{
    switch(action.type) {
        case "CHANGE_FONT_FAMILY": {
            return {...state, fontFamily:action.data }
        }
        default: {
            return state;
        }
    }
}

export default reducer;