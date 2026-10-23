"use client";

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleLoginUser, handleSignUpUser } from '@/app/(auth-pages)/lib/form-actions';
import { Input } from '../ui/input';


interface FormItem {
    name: string;
    type: string;
    placeHolder: string;
}

interface AuthFormProps {
    type: 'LOGIN' | 'SIGNUP';
    formItems: FormItem[];
}

export type FormState = {
    success: boolean;
    errors?: Record<string, string>;
};

const initialFormState: FormState = {
    success: false,
    errors: {},
};

const AuthForm = (props: AuthFormProps) => {

    const router = useRouter();

    const actionFn = props.type === 'LOGIN' ? handleLoginUser : handleSignUpUser;
    const [state, formAction, pending] = useActionState(actionFn, initialFormState);

    useEffect(() => {
        // Registration should leave the success message visible so the user can sign in.
        if (state.success && props.type === "LOGIN") router.push("/dashboard");
    }, [state.success, props.type, router]);

    return (
        <div className='flex gap-3 flex-col'>
            <form
                action={formAction}
                className='flex flex-col gap-3'>
                {
                    props.formItems.map((item, index) => (
                        <section key={index} className='flex flex-col gap-1'>
                            <label 
                                className='text-sm md:text-[16px]'
                                htmlFor={item.name.replaceAll(" ", "").toLowerCase()}>
                                {item.name}
                            </label>
                            <Input
                                type={item.type}
                                name={item.name.replaceAll(" ", "").toLowerCase()}
                                id={item.name.replaceAll(" ", "").toLowerCase()}
                                placeholder={item.placeHolder}
                                required
                                className="rounded-tl-2xl border-2 focus:outline-none focus:ring-0 py-5"
                            />
                            {
                                state.errors && state.errors[item.name.replaceAll(" ", "").toLowerCase()] &&
                                <p className="text-sm text-red-600">{state.errors[item.name.replaceAll(" ", "").toLowerCase()]}</p>

                            }</section>
                    ))
                }
                {
                    state.errors?.general &&
                    <span className=" text-center text-sm text-red-600">{state.errors["general"]}</span>
                }
                {
                    props.type == "SIGNUP" && state.success &&
                    <p className='text-center opacity-80'>Account Successfully Created, please
                        <Link href="/login" className="flex-1 text-center">
                            <span className='font-bold opacity-100 '> login</span>
                        </Link>
                    </p>
                }
                {
                    props.type == "LOGIN" && state.success &&
                    <p className='text-center text-dark'>Redirecting, please wait...
                    </p>
                }
                <button type='submit'
                    className='bg-black text-gray py-2.5 text-md font-semibold rounded-4xl cursor-pointer hover:bg-blue-200 hover:text-dark transition ease-in-out duration-500'>
                    {
                        props.type == "LOGIN" ?
                            pending ? "Signing in..." : "Sign in" :
                            pending ? "Signing up..." : "Sign up"
                    }
                </button>
            </form>


            {
                props.type == "LOGIN" &&
                <p className='text-center opacity-80'>Don't have account?
                    <Link href="/signup" className="flex-1 text-center">
                        <span className='font-semibold opacity-100'> Sign up</span>
                    </Link>
                </p>
            }

        </div>
    );
};

export default AuthForm;