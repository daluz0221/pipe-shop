'use client';

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSummary = () => {

    const [loaded, setLoaded] = useState(false);
    const { itemsInCart, subTotal, tax, total }= useCartStore( useShallow(state => state.getSummaryInformation()) )



    useEffect(() => {
        setLoaded(true)
    }, [])
    
    if( !loaded ) return <p>Loading...</p>

    return (
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
            <span className="text-right">{ currencyFormat( subTotal ) } </span>

            <span>Impuestos</span>
            <span className="text-right">{ currencyFormat( tax ) } </span>

            <span className="text-2xl mt-5">Total:</span>
            <span className="mt-5 text-2xl text-right">{ currencyFormat( total ) }</span>

        </div>
    )
}
