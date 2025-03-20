'use client';

import { SafeUser } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import Heading from "@/app/components/Heading";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import { FaVrCardboard } from "react-icons/fa6";

interface ListingHeadProps {
    id: string;
    title: string;
    locationValue: string;
    imageSrc: string;
    currentUser?: SafeUser | null
}

const ListingHead = ({
     id,
     title,
     locationValue,
     imageSrc,
     currentUser
}: ListingHeadProps) => {
    const { getByValue } = useCountries();
    const location = getByValue(locationValue);

    return (
        <>
            <Heading
                title={title}
                subTitle={`${location?.region}, ${location?.label}`}
            />
            <div
                className="w-full h-[60vh] overflow-hidden rounded-xl relative"
            >
                <Image
                    alt="Image"
                    src={imageSrc}
                    fill
                    className="object-cover w-full"
                />
                <div className="absolute top-5 right-5 flex flex-row gap-2">
                    <div 
                        onClick={(e) => {
                            e.stopPropagation();
                            // Your VR toggle function here
                        }}
                        className="relative hover:opacity-80 transition cursor-pointer bg-white rounded-full p-1.5"
                    >
                        <FaVrCardboard 
                            size={20} 
                            className="text-neutral-700"
                        />
                    </div>
                    <HeartButton
                        listingId={id}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </>
    )
}

export default ListingHead;