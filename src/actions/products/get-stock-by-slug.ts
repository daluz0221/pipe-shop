'use server'
import prisma from "@/lib/prisma";
import { sleep } from "@/utils";


export const getStockBySlug = async( slug: string ) => {
  try {



        const stockProduct = await prisma.product.findFirst({
           
            where: {
                slug
            },
            select: {
                inStock: true
            }
        });

        if (!stockProduct) return 0;

   

        return stockProduct.inStock


    } catch (error) {
        throw new Error('Error al obtener producto por slug' + error)
    }
}