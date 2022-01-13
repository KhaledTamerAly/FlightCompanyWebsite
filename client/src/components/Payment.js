import React, { Component ,  useState, useEffect } from 'react';
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from 'axios';
import {Button} from "reactstrap";
import CircularProgress from '@mui/material/CircularProgress';

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
    const [isLoading, setIsloading] = useState(false);

    async function handlePayment(e)
    {
        setIsloading(true);
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type:"card",
            card: elements.getElement(CardElement)
        });
        if(!props.isRefund)
        {
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
        }
        else
        {
            const {id} = paymentMethod;
            
            const body = {
                amount: parseInt(props.price),
                id: id
            }
            
            const api = {}; 
            axios.post('/users/refund/'+localStorage.getItem('username'), body, {headers: api});
            props.reserve();
        }
    }
    return (
        <div>
             <form onSubmit={handlePayment} >
                <fieldset className="FormGroup">
                    <div className="FormRow">
                        <CardElement options={CARD_OPTIONS}/>
                    </div>
                </fieldset>
                {!isLoading && <Button color = "success" onClick={handlePayment}>Pay</Button>}
            </form>
            {isLoading && <CircularProgress />}
            <br/>
        </div>
    );
}

export default Payment;