import { createContext, useCallback, useReducer } from 'react';
import axios from 'axios';
import QuickShareReducer from './quickShareReducer';

const URL = 'http://localhost:8080';
const QuickShareContext = createContext();

const QuickShareProvider = ({ children }) => {
    const initialState = {
        code: '',
        key: '',
        isLoading: false,
        isError: false,
        errMsg: '',
        showMsgBox: false
    };

    const [state, dispatch] = useReducer(QuickShareReducer, initialState);

    const downloadFile = useCallback(async (key, code) => { 
        setIsLoading();
    try {
        const res = await axios.get(`${URL}/file`, {
            responseType: 'blob',  // 👈 this is crucial for file downloads
            params: {
                'key': key,
                'code': code,
            }
        });
        

        if (res) { 
    // Try to extract filename from the response headers
            const disposition = res.headers['content-disposition'];
            let filename;

            if (disposition && disposition.includes('filename=')) {
                filename = disposition
                    .split('filename=')[1]
                    .replace(/['"]/g, '')
                    .trim();
            }

            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', filename); // Will retain original name
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);

            dispatch({
                type: 'DOWNLOAD',
                payload: res.data,
            });
        }

    } catch (e) { 
        // Handle error here
        console.error('Error fetching data:', e);
    }
    }, []);

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
            uploadFile,
            downloadFile
        }}>
            {children}
        </QuickShareContext.Provider>
    );
};

export { QuickShareContext, QuickShareProvider };
