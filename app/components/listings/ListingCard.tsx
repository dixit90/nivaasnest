'use client';

import { Reservation } from "@prisma/client";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { format } from "date-fns"
import React, { useCallback, useMemo } from "react";

import useCountries from "@/app/hooks/useCountries";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import Button from "@/app/components/Button";
import { FaVrCardboard } from "react-icons/fa6";

interface ListingCardProps {
    data: SafeListing;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null
}

const ListingCard = ({
    data,
    reservation,
    onAction,
    disabled,
    actionLabel,
    actionId = '',
    currentUser
}: ListingCardProps) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if(disabled) {
            return;
        }

        onAction?.(actionId);
    }, [onAction, actionId, disabled]);

    const price = useMemo(() => {
        if(reservation) {
            return reservation.totalPrice
        }

        return data.price
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if(!reservation) {
            return null;
        }

        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate);

        return `${format(start, 'PP')} - ${format(end, 'PP')}`;

    }, [reservation])

    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="col-span-1 cursor-pointer group"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <Image
                        fill
                        src={data.imageSrc}
                        alt="Listing"
                        className="object-cover w-full h-full group-hover:scale-110 transition"
                    />
                    <div className="absolute top-3 right-3 flex flex-row gap-2">
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                // Your VR toggle function here
                            }}
                            className="relative hover:opacity-80 transition cursor-pointer bg-white rounded-full p-1.5"
                        >
                            <FaVrCardboard 
                                size={18} 
                                className="text-neutral-700"
                            />
                        </div>
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        $ {price}
                    </div>
                    {!reservation && (
                        <div className="font-light">night</div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
            </div>
        </div>
    )
}

export default ListingCard;