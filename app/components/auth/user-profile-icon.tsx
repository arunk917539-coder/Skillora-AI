
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@radix-ui/react-menubar';
import React from 'react';

import Image from "next/image";
import { SignOutButton } from './sign-out';
import { auth } from '@/app/(auth-pages)/auth';

type UserProfileTypes = {
    isOptionEnabled?: boolean
}

const UserProfileIcon = async (prop: UserProfileTypes) => {
    let Session = null;
    try {
        Session = await auth();
    } catch {
        Session = null;
    }

    return (
        Session &&
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>
                    <Image
                        src={Session.user?.image ?? "/logo.png"}
                        className="rounded-full object-center"
                        height={42}
                        width={42}
                        alt="user image"
                    />
                </MenubarTrigger>

                < MenubarContent className='bg-gray px-4 py-1.5 min-w-[120px] rounded-sm'>
                    <MenubarItem className='text-dark font-semibold hover:border-0 cursor-pointer'>
                        <SignOutButton />
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default UserProfileIcon;