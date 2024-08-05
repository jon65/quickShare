import { createContext, useEffect, useCallback, useReducer } from 'react';
import axios from 'axios';
import QuickShareReducer from './quickShareReducer';

const URL = 'http://54.169.27.251:8080';

const QuickShareContext = createContext();

const QuickShareProvider = ({ children }) => {
    const initialState = {
        code: 'test',
        key: 'dsasda',
        isLoading: false,
        isError: false,
        errMsg: '',
        showMsgBox: false
    };

    const [state, dispatch] = useReducer(QuickShareReducer, initialState);

    const uploadFile = useCallback(async (file, filename) => { 
        setIsLoading();

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', filename);

            const res = await axios.post(`${URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setTimeout(() => { 
                dispatch({ type: 'CANCEL_BOX', payload: false }) 
            }, 3000);

            if (res) { 
                dispatch({
                    type: 'FINISH_UPLOAD',
                    payload: {
                        code: res.data.code,
                        key: res.data.key,
                    },
                });
            }
        } catch (err) {
            dispatch({
                type: 'API_ERROR',
                payload: err.response?.value || 'Unknown error',
            });
        }
    }, []);

    const setIsLoading = () => {
        dispatch({ type: 'LOADING' });
    }

    return (
        <QuickShareContext.Provider value={{
            ...state,
            dispatch,
            uploadFile
        }}>
            {children}
        </QuickShareContext.Provider>
    );
};

export { QuickShareContext, QuickShareProvider };
