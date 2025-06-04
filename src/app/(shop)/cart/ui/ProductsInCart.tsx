'use client';

import { QuantitySelector } from "@/components";
import { useHydratedCart } from "@/config";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";



export const ProductsInCart = () => {


    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore( state => state.cart );
    const updateProductQuantity = useCartStore( state => state.updateProductQuantity );
    const deleteProduct = useCartStore( state => state.deleteProductQuantity );
        const hasHydrated = useHydratedCart();
    
    if (!hasHydrated) return <p>Cargando...</p>;

  
    
    if (productsInCart.length === 0) {
        redirect('/empty')
      }
   

   

    return (
        <>
            {
            productsInCart.map((product) => (
                <div className="flex mb-5" key={`${ product.slug }-${product.size}`}>
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
                        <Link href={`/product/${ product.slug }`} className="hover:underline cursor-pointer">{product.title}</Link>
                        <p>{product.size}</p>
                        <p>${product.price}</p>
                        <QuantitySelector quantity={product.quantity} onQuantityChange={ quantity => updateProductQuantity( product, quantity )
                         } />

                        <button className="underline mt-3 cursor-pointer" onClick={()=> deleteProduct(product)}>
                            Remover
                        </button>
                    </div>
                </div>
            ))
        }
        </>
    )
}
