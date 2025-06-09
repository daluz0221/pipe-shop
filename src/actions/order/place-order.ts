'use server';

import { auth } from "@/auth.config";
import { Address, ValidSizes } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: ValidSizes
}


export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sessión de usuario'
        }
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    //Calcular los montos // Encabezados

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

    // Los totales de tax, subTotal y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals

    }, { subTotal: 0, tax: 0, total: 0 })

    // Crear la transaciión de base de datos
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            // 1. Actualizar el store de los productos
            const updatedProductsPromises = products.map((prodcut) => {

                // Acumular los valores
                const productQuantity = productIds.filter(
                    p => p.productId === prodcut.id
                ).reduce((acc, item) => item.quantity + acc, 0)

                if (productQuantity === 0) {
                    throw new Error(`${prodcut.id} no tiene cantidad definida`)
                }


                return tx.product.update({
                    where: { id: prodcut.id },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })

            });

            const updatedProducts = await Promise.all(updatedProductsPromises);
            // Verificar valores negativos en la existencia = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })


            // 2. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            });

            // Validar, si el price es cero, entonces, lanzar un error


            // 3. Crear la dirección de la orden
            // Mi solución
            const orderAddress = await tx.orderAddress.create({
                data: {
                    firsName: address.firsName,
                    lastName: address.lastName,
                    address: address.address,
                    address2: address.address2,
                    postalCode: address.postalCode,
                    phone: address.phone,
                    city: address.city,
                    countryId: address.country,
                    orderId: order.id
                }
            });

            // Solución de fernando
            // const { country, ...restAddress } = address;
            // const orderAddress = await tx.orderAddress.create({
            //     data: {
            //         ...restAddress,
            //         countryId: country,
            //         orderId: order.id
            //     }
            // });

            return {
                order: order,
                orderAddress: orderAddress,
                updatedProducts: updatedProducts,
            }

        });


        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }
    } catch (error) {
        console.log(error);
        
        return {
            ok: false,
            message: 'revisar los logs'
        }
    }




};

