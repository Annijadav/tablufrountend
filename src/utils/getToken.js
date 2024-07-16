export const getLocalStorgeToken = {
    headers: {
        authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('authToken') : ''}`
    }
};