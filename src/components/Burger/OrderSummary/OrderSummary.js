import React from 'react'
import Aux from "../../../hoc/Auxiliary"
import Button from "../../UI/Button/Button"

const orderSumary = (props) => {
    const capitalize = {capitalize: 'capitalize'}
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => (
            <li key={igKey}>
                <span style={capitalize}>
                    {igKey}
                </span>: {props.ingredients[igKey]}
            </li>
        ))

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicuous burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Continue to Checkout?</p>
            <Button
                btnType="Danger"
                clicked={props.purchaseCanceled}>                
                CANCEL
            </Button>
            <Button
                btnType="Success"
                clicked={props.purchaseContinued}>                
                CONTINUE
            </Button>
        </Aux>
    )
}

export default orderSumary