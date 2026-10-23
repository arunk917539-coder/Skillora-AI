"use client";

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image';

const data = {
    login: {
        header: "Log in to your account",
        subheader:"Welcome back! Please Enter your details."
    },
    signup: {
        header: "Create a new account",
        subheader: "Welcome! Please enter your details to sign up."
    }
}


const AuthHeader = () => {
    const pathname = usePathname()
    const isSignUpSelected = pathname === '/signup'

    const key = isSignUpSelected ? 'signup' : 'login';

    const { header, subheader } = data[key];

    return (
        <section className='flex flex-col text-dark gap-3 items-center justify-center w-full max-w-md pb-3'>
            <div className='flex items-center flex-col font-bold justify-center'>
                <Link href={"/"}>
                    <h3 className='text-3xl hover:bg-blue-200 border-[1px] border-black rounded-3xl px-3 py-2.5 font-semibold flex items-center'><span className='font-bold text-4xl'>W</span>orkplace Compass</h3>
                </Link>
            </div>
            <div className='text-center flex flex-col gap-1'>
                <h2 className=' font-semibold text-xl md:text-2xl'>{header}</h2>
                <p className='text-sm md:text-[16px]'>{ subheader}</p>
            </div>
            <div className="flex flex-row items-center justify-center w-full text-center">
                <Link href="/signup" className="flex-1">
                    <div className={`w-full border-none py-2 rounded-tl-3xl rounded-br-2xl-2xl font-semibold  ${isSignUpSelected ? "btn-select" : "btn-deselect"}`}>
                        Sign up
                    </div>
                </Link>

                <Link href="/login" className="flex-1">
                    <div className={`w-full border-none py-2 rounded-br-3xl font-semibold  ${!isSignUpSelected ? "btn-select" : "btn-deselect"}`}>
                        Log in
                    </div>
                </Link>
            </div>
        </section>
    )
}

export default AuthHeader