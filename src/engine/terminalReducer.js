// pour le reducer
export const initialState = {
  currentPath: ["home"],
  history:[],
  isWon:false
}

export function terminalReducer(state,action){

  switch(action.type){
    case "ADD_LINE" : 
      return {
        ...state,
        history: [...state.history, action.payload],
      };
      case  "NAVIGATE":
        return{
          ...state,
          currentPath:action.payload,
        }
      case "WIN_LEVEL":
        return{
          ...state,
          isWon:true
        }
      case "RESET":
        return initialState
      default :
        return state;

  }

}