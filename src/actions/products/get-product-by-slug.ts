import prisma from "@/lib/prisma";




export const getProductBySlug = async( slug: string ) => {


    try {
        const product = await prisma.product.findFirst({
            include: {
                Image: true
            },
            where: {
                slug
            }
        });

        if (!product) return null;



        return {
            ...product,
            images: product.Image.map( img => img.url )
        }


    } catch (error) {
        console.log(error);
        
        throw new Error('Error al obtener producto por slug')
    }

};
