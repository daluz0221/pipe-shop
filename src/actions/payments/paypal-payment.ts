'use server'

import { PayPalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export const paypalCheckPayment = async (transactionId: string | undefined) => {

    const authToken = await getPaypalBareToken();

    console.log(authToken);

    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificación'
        }
    };

    const resp = await verifyPayPalBearerToken( transactionId!, authToken )

    if (!resp){
        return {
            ok: false,
            message: 'Error al verificar el pago'
        }
    };

    const { status, purchase_units } = resp;
    const { invoice_id: orderId } = purchase_units[0];

    // const {} = purchase_units[0] TODO: invoice id

    
    if (status !== 'COMPLETED'){
        return {
            ok: false,
            message: 'Aun no se ha pagado en paypal'
        } 
    };
    
    //Realizar actualizacion en bd

    try {
        console.log({status, purchase_units});

        await prisma.order.update({
            where: {id:orderId},
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })

        // revalidar un path
        revalidatePath(`/orders/${ orderId }`);

        return {
            ok:true
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: '500 - el pago no se pudo realizar'
        }
    }
    

};



const getPaypalBareToken = async (): Promise<string | null> => {


    const client_id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const paypal_secret = process.env.PAYPAL_SECRET
    const oauthUrl = process.env.PAYPAL_OAUTH_URL ?? ''

    const base64Token = Buffer.from(
        `${client_id}:${paypal_secret}`, "utf-8"
    ).toString('base64')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(oauthUrl, requestOptions).then(r => r.json());

        return result.access_token

    } catch (error) {
        console.log(error);
        return null
    }


};
const verifyPayPalBearerToken = async (paypalTransactionId: string, bearerToken: string): Promise<PayPalOrderStatusResponse|null> => {

    const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ paypalTransactionId }`

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);



    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    try {
       const resp = await fetch(paypalOrderUrl, requestOptions).then(r => r.json());

       return resp
    } catch (error) {
        console.log(error);
        return null
    }


};