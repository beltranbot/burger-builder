import * as actionTypes from './actionTypes'
import axios from 'axios'
import {FIREBASE_API_KEY} from '../../env'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSucess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId
    }
}

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error
    }
}

export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`
        if (!isSignUp) {
            url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_API_KEY}`
        }
        axios.post(url, authData)
            .then(response => {
                console.log(response)
                dispatch(authSucess(response.data.idToken, response.data.localId))
            })
            .catch(error => {
                console.log(error)
                dispatch(authFailed(error.response.data.error))
            })
    }
}