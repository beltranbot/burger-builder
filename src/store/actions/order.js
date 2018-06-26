import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData
    }
}

export const purchaseBurgerFailed = error => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error
    }
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }    
}

export const purchaseBurger = (order) => {
    return dispatch => {
        dispatch(purchaseBurgerStart())
        axios.post('/orders.json', order)
            .then(res => dispatch(purchaseBurgerSuccess(res.data, order)))
            .catch(err => dispatch(purchaseBurgerFailed(err)))
    }
}