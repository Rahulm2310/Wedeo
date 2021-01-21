import React, { Fragment } from 'react'
import Meta from './Meta'

export default function BaseLayout({children}) {
    return (
        <div>
            <Meta/>
            <div>{children}</div>
        </div>
    )
}
