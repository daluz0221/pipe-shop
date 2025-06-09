import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {

    cart: CartProduct[];

    getTotalItems: () => number;
    getSummaryInformation: () => { subTotal: number; tax: number; total: number; itemsInCart: number; };
    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    deleteProductQuantity: (product: CartProduct) => void;

    clearCart: () => void
}


export const useCartStore = create<State>()(

    persist(
        (set, get) => ({

            cart: [],



            //Methods

            getTotalItems: () => {

                const { cart } = get();


                return cart.reduce((total, item) => total + item.quantity, 0)
            },
            getSummaryInformation: () => {

                const { cart } = get()

                const subTotal = cart.reduce(
                    (subTotal, product) => (product.quantity * product.price) + subTotal,
                    0)

                const tax = subTotal * 0.15;
                const total = subTotal + tax
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0)

                return {
                    subTotal,
                    tax,
                    total,
                    itemsInCart
                }
            },

            addProductToCart: (product: CartProduct) => {
                const { cart } = get();
       
                // 1. Revisar si el productr existe en el cart con la talla selecioanda
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                );
                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return
                };

                // 2. Sé que el prod existe por talla, hay que incrementarlo
                const updatedCartProducts = cart.map((item) => {

                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    };

                    return item

                });

                set({ cart: updatedCartProducts })
            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map(item => {

                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item, quantity
                        }
                    }

                    return item

                })

                set({ cart: updatedCartProducts })
            },

            deleteProductQuantity: (product: CartProduct) => {

                const { cart } = get();

                const updatedCartProducts = cart.filter(item => {

                    if (!(item.id === product.id && item.size === product.size)) return item

                })

                set({ cart: updatedCartProducts })

            },

            clearCart: () => {
                set({ cart: [] })
            },
        })

        , {
            name: 'shopping-cart'
        }
    )


)