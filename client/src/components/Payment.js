import React, { Component ,  useState, useEffect } from 'react';
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from 'axios';
import {Button} from "reactstrap";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}
function Payment(props)
{
    const stripe = useStripe();
    const elements = useElements();

    async function handlePayment(e)
    {
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type:"card",
            card: elements.getElement(CardElement)
        });
        console.log(error);
        if(!error)
        {
            const {id} = paymentMethod;
            const response = await axios.post('/users/payment', {
                amount: parseInt(props.price),
                id: id
            })
            if(response.data.success)
            {
                console.log("Payment Success");
                props.reserve();
            }
        }
        else
        {
            console.log(error)
        }
    }
    return (
             <form onSubmit={handlePayment} >
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={CARD_OPTIONS}/>
                        {console.log(props.price)}
                    </div>
                </fieldset>
                <Button color = "success" onClick={handlePayment}>Pay</Button>
            </form>
    );
}

export default Payment;