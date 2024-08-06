

const QuickShareReducer = (state, action) => { 
    switch (action.type) { 
        default:
            return state;
        
        case 'DOWNLOAD':
            return {
                ...state,
                isError: false,
                isLoading: false,
            }
        
        case 'LOADING':
            return {
                ...state,
                isError: false,
                isLoading: true,
            }
    
        case 'UPLOADING':
            return {
                ...state,
                isLoading: true,
            }
        case 'FINISH_UPLOAD':
            return {
                ...state,
                isLoading: false,
                code: action.payload.code,
                key: action.payload.key,
            }
        case 'API_ERROR':
            return {
                ...state,
                isLoading: false,
                isError: true,
                errorMsg: action.payload,
                showMsgBox: true
            }
    }
}

export default QuickShareReducer;