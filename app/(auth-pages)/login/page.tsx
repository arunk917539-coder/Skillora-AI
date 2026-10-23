"use server";

import React from 'react';

import AuthHeader from '@/app/components/auth/auth-header';
import AuthForm from '@/app/components/auth/auth-form';


const formItems = [
    { name: "Email", type: "email", placeHolder: "enter your email" },
    { name: "Password", type: "password", placeHolder: "enter your password" },
]


const SignInPage = async () => {
    return (
        <article className='bg-gray flex items-center gap-5 flex-col justify-center h-full px-4'>
            <AuthHeader />
            <div className='w-full max-w-md'>
                <AuthForm formItems={formItems} type='LOGIN' />
            </div>
        </article>
    )
}

export default SignInPage