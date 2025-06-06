'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";




export const setTransactionId = async (transactionId: string, orderId: string) => {


    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sessión de usuario'
        }
    };

    try {

        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                transactionId: transactionId
            }
        });

        if (!order) {
            return {
                ok:true,
                message: `order con el id ${orderId} no encontrado`
            }
        }


    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo realizar la transacción'
        }
    };

    return {
        ok: true,
        message: 'Se realizó correctamente la transacción'
    }


};