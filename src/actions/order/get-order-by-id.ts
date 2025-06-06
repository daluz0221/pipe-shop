'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";



export const getOrderById = async (id: string) => {

    const session = await auth();
    const userId = session?.user.id

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sessión de usuario'
        }
    };

    try {
        const order = await prisma.order.findUnique({
            where: {
                id: id
            },
            include: {
                OrderAddress: true,
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,
                                Image : {
                                    select: {
                                        url: true
                                    },
                                    take:1
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!order) throw `${ id } no existe`;

        if ( session.user.role === 'user' ){
            if ( userId !== order.userId ){
                throw `${ id } no es del usuario`
            }
        };

        

        return {
            ok: true,
            order
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Hable con el administrador'
        }
    }



}

