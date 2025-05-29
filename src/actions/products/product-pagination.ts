'use server';

import { Gender } from "@/generated/prisma";
import prisma from "@/lib/prisma";


interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}


export const getPaginateProductsWithImages = async({ page = 1, take = 12, gender  }: PaginationOptions) => {
  
    if( isNaN(Number(page)) ) page = 1;
    if(page < 1) page = 1;

    try {

        // 1. Obtener los prodcutos
        const products = await prisma.product.findMany({
            take: take,
            skip: ( page - 1 ) * take,
            include: {
                Image: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            }
        });


        if (gender){
            let genderFilter = {}
            if(gender === 'kid'){
                genderFilter = { gender: { in: [gender] } };
            } else {
                genderFilter = { gender: { in: [gender, 'unisex'] } };
            }
            const products = await prisma.product.findMany({
                where: genderFilter,
                take: take,
                skip: ( page - 1 ) * take,
                include: {
                    Image: {
                        take: 2,
                        select: {
                            url: true
                        }
                    }
                }
            });
            const totalCount = await prisma.product.count({
                where: {
                    gender: gender || 'unisex'
                } 
            });
            const totalPages = Math.ceil( totalCount / take )

            return {
            currentPage: page,
            totalPages,
            products: products.map( product =>({
                ...product,
                images: product.Image.map( image => image.url )
            }))
        }
        }
 
        // 2. Obtener el total de página
        // TODO: 
        const totalCount = await prisma.product.count({});
        const totalPages = Math.ceil( totalCount / take )


        return {
            currentPage: page,
            totalPages,
            products: products.map( product =>({
                ...product,
                images: product.Image.map( image => image.url )
            }))
        }



    } catch (error) {
        console.log({error});
        
        throw new Error('No se pudo ejecutar la carga de productos')
    }

}