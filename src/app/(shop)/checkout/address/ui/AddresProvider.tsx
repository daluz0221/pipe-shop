'use client'

import { useAddressStore } from "@/store";
import { AddressForm } from "./AddressForm";
import { Address, Country } from "@/interfaces";
import { useHydratedAddress } from "@/config";


interface Props {
    countries: Country[];
    userStoreAddress?: Partial<Address>
}


export default function AddresProvider({ countries, userStoreAddress = {} }:Props) {

     const storeAddress = useAddressStore( state => state.address );
     const hasHydrated = useHydratedAddress();

     if (!hasHydrated) return <p>Cargando...</p>;

     
    

  return (
    <>
        <AddressForm countries={countries} storeAddress={storeAddress} userStoreAddress={userStoreAddress} />
    </>
  );
}