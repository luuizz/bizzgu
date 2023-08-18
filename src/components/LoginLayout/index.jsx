import React from 'react';
import {LoginLayoutWrapper} from './style'

export function LoginLayout({children}) {
    return (
        <LoginLayoutWrapper>
            {children}
        </LoginLayoutWrapper>
    )
}