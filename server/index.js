import express from 'express'
import Stripe from 'stripe'

const app = express()
const port = 3000
const PUBLISHABLE_KEY = 'pk_test_51L27ZTJXUnAoewxpe5quuGzoKt3JOLtcDsJMzfupnOuGFma7tmX89ZLdlaVufC8fPt175jmCS2fmBZDMbJSkzCbY00b9EYDXIX'
const SECRET_KEY = 'sk_test_51L27ZTJXUnAoewxpuz7i9LBnqFKvR7LFO1UI0s8ObYi4XczQwoBkyqbzGZCCndeXuSyCHGlEeWep28XagHjEpWSz002kEnJlLM'
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" })

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.post("/create-payment-intent", async(req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 1099, 
          currency: "ron",
          payment_method_types: ["card"], 
        });
    
        const clientSecret = paymentIntent.client_secret;
        res.json({
          clientSecret: clientSecret,
        });

      } catch (error) {
        console.log(error.message);
        res.json({ error: error.message });
      }
})