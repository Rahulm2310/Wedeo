import React from 'react';
import Link from 'next/link';

export default function BackButton({route}) {
    return (
        <Link href={route}>
            <div className="back-button">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <p>Back</p>
            </div>
        </Link>
    )
}
