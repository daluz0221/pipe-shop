'use client';

import { titleFont } from "@/config/fonts"
import { useUiStore } from "@/store";
import Link from "next/link"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"

export const TopMenu = () => {

    const openMenu = useUiStore( state => state.openSideMenu );
  return (
    <nav className="flex px-5 justify-between items-center w-full">

        {/* Logo */}
        <div>
            <Link href={'/'}>
                <span className={`${ titleFont.className } antialiased font-bold `}>Pipe</span>
                <span>| Shop</span>
            </Link>
        </div>

        {/* Center menu */}
        <div className="hidden sm:block">

            <Link href={'/category/men'} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">Hombres</Link>
            <Link href={'/category/women'} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">Mujeres</Link>
            <Link href={'/category/kids'} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">Niños</Link>

        </div>

        {/* Search, cart and menu */}
        <div className="flex items-center">
            <Link href={'/search'}>
                <IoSearchOutline className="w-5 h-5 mx-2" />
            </Link>

            <Link href={'/cart'}>
                <div className="relative">
                    <span className="absolute text-xs rounded-full px-1 font-bold -top-2 bg-blue-700 text-white -right-2">
                        3
                    </span>
                    <IoCartOutline className="w-5 h-5 mx-2" />
                </div>
            </Link>

            <button onClick={openMenu} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
                Menu
            </button>
        </div>


    </nav>
  )
}
