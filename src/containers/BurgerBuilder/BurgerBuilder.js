import React, {Component} from 'react'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import Spinner from '../../components/UI/Spinner/Spinner'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentWillMount () {
        axios.get('/ingredients.json')
            .then(response => this.setState({ingredients: response.data}))
            .catch(err => {
                this.setState({error: true})
                console.log(err)
            })
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((a, c) => a + c, 0)
        this.setState({purchasable: (sum > 0)})
    }

    addIngredientHandler = type => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {...this.state.ingredients}
        updatedIngredients[type] = updatedCount
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientHandler = type => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) return
        const updatedCount = oldCount - 1
        const updatedIngredients = { ...this.state.ingredients }
        updatedIngredients[type] = updatedCount
        const priceDeduction = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceDeduction
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients)
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Max Schawrzmüller',
                address: {
                    street: 'Teststreet 1',
                    zipCode: '41351',
                    country: 'Germany'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json', order)
            .then(res => {
                this.setState({loading: false, purchasing: false})
            })
            .catch(err => {
                this.state({loading: false, purchasing: false})
                console.log(err)
            })
    }

    render () {
        const disabledInfo = {...this.state.ingredients}
        for (const key in disabledInfo) {
            disabledInfo[key] = (disabledInfo[key] <= 0)
        }

        let orderSummary = null
        let burger = this.state.error ? <p>Ingredients can't be loaded.</p>
            : <Spinner />

        if (this.state.ingredients) {
            orderSummary = (
                <OrderSummary
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    ingredients={this.state.ingredients}
                    price={this.state.totalPrice.toFixed(2)} />
            )
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux >
            )
        }
        if (this.state.loading) orderSummary = <Spinner />

        return (
            <Aux>
                <Modal
                    show={this.state.purchasing}
                    modalClose={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}                                
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)