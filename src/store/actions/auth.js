import * as actionTypes from './actionTypes'
import axios from 'axios'
import {FIREBASE_API_KEY} from '../../env'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSucess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData
    }
}

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error
    }
}

export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        axios.post(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`,
            authData
        ).then(response => {
            console.log(response)
            dispatch(authSucess(response.data))
        })
        .catch(error => {
            console.log(error)
            dispatch(authFailed(error))
        })
    }
}