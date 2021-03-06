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

export const purchaseBurger = (order, token) => {
    return dispatch => {
        dispatch(purchaseBurgerStart())
        axios.post(`/orders.json?auth=${token}`, order)
            .then(res => dispatch(purchaseBurgerSuccess(res.data.name, order)))
            .catch(err => dispatch(purchaseBurgerFailed(err)))
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders
    }
}

export const fetchOrdersFailed = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAILED,
        error
    }
}

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START,
    }
}

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart())
        const queryParams =
            `?auth=${token}&orderBy="userId"&equalTo="${userId}"`
        axios.get(`/orders.json${queryParams}`)
            .then(res => {
                const fetchedOrders = []
    
                for (const key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    })
                }
    
                dispatch(fetchOrdersSuccess(fetchedOrders))
            })
            .catch(err => dispatch(fetchOrdersFailed(err)))
    }
}