'use server'



export const paypalCheckPayment = async (transactionId: string | undefined) => {

    const authToken = await getPaypalBareToken();

    console.log(authToken);
    
    if (!authToken){
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificación'
        }
    }


};


const getPaypalBareToken = async (): Promise<string|null> => {


    const client_id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const paypal_secret = process.env.PAYPAL_SECRET
    const oauthUrl = process.env.PAYPAL_OAUTH_URL ?? ''

    const base64Token = Buffer.from(
        `${ client_id }:${ paypal_secret }`, "utf-8"
    ).toString('base64')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${ base64Token }`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    try {
        const result = await fetch(oauthUrl, requestOptions).then( r => r.json());

        return result.access_token

    } catch (error) {
        console.log(error);
        return null
    }


};