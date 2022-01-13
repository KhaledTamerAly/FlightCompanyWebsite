import '../AppPay.css';
import React, { Component ,  useState, useEffect } from 'react';
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import Payment from './Payment';


function StripeComponent(props)
{

    const PUBLIC_KEY = "pk_test_51KEZLtGUSAqRaITf8YVxIbOKMokr8s5rRJdSCtmeqlSSFxixSnxOsXMT8WjmWvz6WB62cGKYPirxc4pA06OAwBqe00dZcnlHPW";
    const stripe = loadStripe(PUBLIC_KEY);
    return (
        <div className='AppPay'>
            {!props.isRefund && <>You will pay a total of {props.price} Euros</>}
            {props.isRefund && <>Once you pay, you will be refunded a total of {-1* props.price} Euros</>}
        <Elements stripe={stripe}>
            <Payment price = {props.price} reserve= {props.reserve} isRefund={props.isRefund??false}/>
        </Elements>
        </div>
    );
}

export default StripeComponent;