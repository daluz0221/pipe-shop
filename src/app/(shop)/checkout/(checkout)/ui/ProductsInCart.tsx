'use client';

import { useHydratedCart } from "@/config";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";



export const ProductsInCart = () => {


    const productsInCart = useCartStore(state => state.cart);
    const hasHydrated = useHydratedCart();

    if (!hasHydrated) return <p>Cargando...</p>;



    if (productsInCart.length === 0) {
        redirect('/empty')
    }




    return (
        <>
            {
                productsInCart.map((product) => (
                    <div className="flex mb-5" key={`${product.slug}-${product.size}`}>
                        <Image
                            src={`/products/${product.image}`}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={product.title}
                            className="mr-5 rounded"
                        />

                        <div >
                            <span>{ product.size } - { product.title } ({ product.quantity })</span>
                            <p className="font-bold">{ currencyFormat( product.price * product.quantity ) }</p>                         
                        </div>
                    </div>
                ))
            }
        </>
    )
}
