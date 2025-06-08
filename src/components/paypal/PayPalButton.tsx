'use client';



import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from '@paypal/paypal-js'
import { paypalCheckPayment, setTransactionId } from '@/actions';


interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = (Math.round(amount * 100)) / 100

    if (isPending) {
        return (
            <div className='animate-pulse mb-16'>
                <div className='h-11 bg-gray-300 rounded'></div>
                <div className='h-11 bg-gray-300 rounded mt-2'></div>
            </div>
        )
    };

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'USD'
                    }
                }
            ],
            intent: 'CAPTURE'
        })

        console.log({ transactionId });
        // TODO: guardar el id en la orden en la bd
        const { ok } = await setTransactionId(transactionId, orderId);
        if (!ok) {
            throw new Error('No se pude realizar la transacción')
        };


        return transactionId
    };

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {


        const details = await actions.order?.capture();
        if (!details) return;

        await paypalCheckPayment(details.id)

    };


    return (
        <div className='relative z-0'>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    )
}
