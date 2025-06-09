'use client';

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";



export const PlaceOrder = () => {



    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const address = useAddressStore(state => state.address);
    const { itemsInCart, subTotal, tax, total } = useCartStore(useShallow(state => state.getSummaryInformation()))
    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)



    useEffect(() => {
        setLoaded(true)
    }, []);


    const onPlaceOrder = async () => {

        setIsPlacingOrder(true);

        const productsToOder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))


        // console.log({address, productsToOder});

        const resp = await placeOrder(productsToOder, address);
        if (!resp.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message!);
            return;
        }

        // * Todo salió bien


        clearCart();
        window.location.replace('/orders/' + resp.order!.id);



    };

    if (!loaded) {
        return <p>Cargando...</p>
    }


    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p>{address.firsName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>


            <h2 className="text-2xl font-bold mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">
                    {
                        itemsInCart > 1
                            ? `${itemsInCart} Artículos`
                            : '1 Artículo'
                    }
                </span>

                <span>Sub Total</span>
                <span className="text-right">{currencyFormat(subTotal)} </span>

                <span>Impuestos</span>
                <span className="text-right">{currencyFormat(tax)} </span>

                <span className="text-2xl mt-5">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer click en &apos;Colocar orden&apos;, aceptas nuestros <a href="#" className="underline">Términos y condiciones</a> y <a href="#" className="underline">políticas de privacidad</a>
                    </span>
                </p>

                <p className="text-red-500">
                    {errorMessage}
                </p>
                <button className={
                    clsx({
                        'btn-primary': !isPlacingOrder,
                        'btn-disabled': isPlacingOrder
                    })
                }
                    disabled={isPlacingOrder}
                    // href="/orders/123"
                    onClick={onPlaceOrder}
                >
                    Colocar orden
                </button>
            </div>
        </div>
    )
}
