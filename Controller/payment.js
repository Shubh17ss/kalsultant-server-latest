
const stripe=require('stripe')('sk_test_51KRCZgSHIWJCaDoUKAkTrq1dz9HbRrbd1flGs0bSne0peHOl2k2vMG4TUfLIlJeVSHqn30bDVoo9zP4aBr0HKSPD00N5MOMaLI')

const createIntent=async (req,res)=>{
    const paymentIntent=await stripe.paymentIntents.create({
        amount:149900,
        currency:'inr',
        automatic_payment_methods:{
            enabled:true
        },
    });

    res.status(200).json({client_secret:paymentIntent.client_secret});
}

module.exports={
    createIntent,

}