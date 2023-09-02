import React from 'react';
import Skeleton from 'react-loading-skeleton';

export function CardSkeleton() {
    return (
        <>
            <div className="card-skeleton">
                <div className="top">
                    <Skeleton width={218} height={184}/>
                </div>
                <div className="center">
                    <Skeleton />
                </div>
            </div>
            
        </>
    )
}