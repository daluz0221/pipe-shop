import prisma from "@/lib/prisma";




export const getProductBySlug = async( slug: string ) => {


    try {
        const product = await prisma.product.findFirst({
            include: {
                Image: {
                    select: {
                        url:true
                    }
                }
            },
            where: {
                slug
            }
        });

        if (!product) return null;

        const { Image, ...rest } = product

        return {
            ...rest,
            images: product.Image.map( img => img.url )
        }


    } catch (error) {
        throw new Error('Error al obtener producto por slug')
    }

};
