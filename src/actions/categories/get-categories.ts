'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";




export const getCategories = async() => {
  

    const session = await auth();

    if (!session?.user.id || session.user.role !== 'admin'){
        return {
            ok: true,
            message: 'El usuario debe estar autenticado y ser administrador'
        }
    };

    try {
        const categories = await prisma.category.findMany();

        return {
            ok:true,
            categories
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Error al traer las categorias, revisar los logs'
        }
    }


};

