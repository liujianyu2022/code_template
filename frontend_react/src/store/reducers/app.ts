import { AppActionType, AppAction, AppStateType } from "@/types/ReducerTypes"

const initialValue : AppStateType = { 
    isLoading: false, 
}

const appReducer = (state: AppStateType = initialValue, action: AppActionType) => {
    switch (action.type) {
        case AppAction.INITIAL:
            return state
        case AppAction.LOADINGCHANGE:
            return { ...state, isLoading: action.payload.isLoading }
        default:
            return state
    }
}

export default appReducer