const mercadopago = require("mercadopago")

mercadopago.configure({
    access_token: "TEST-2222748902091548-120519-5981c0d4da6613d66a175d3ca32bfa4f-1578580869"
})

const postMercadoPago = async (req, res) => {
    
        const preference = req.body
        const responseMP = await mercadopago.preferences.create(preference)
        console.log(responseMP)
        res.json({
            checkoutId: responseMP.body.id
        })
}

module.exports = {
    postMercadoPago
}