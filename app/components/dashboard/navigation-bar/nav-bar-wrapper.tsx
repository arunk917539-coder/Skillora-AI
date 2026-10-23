"use client";

import { Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import DashboardNavBar from './nav-bar';
import { AppSidebar } from './side-nav-bar';

const NavBarContainer = () => {
    const [isMenuSelected, setInMenuSelected] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleMenuSelect = () => {
        setInMenuSelected(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setInMenuSelected(false);
            }
        };

        if (isMenuSelected) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';

        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isMenuSelected]);

    return (
        <article>
            <div className="visible pt-10 lg:hidden transition duration-700">
                <Menu onClick={handleMenuSelect} />
            </div>
            {isMenuSelected && (
                <div ref={sidebarRef} className='    '>
                    <AppSidebar callBack={setInMenuSelected} />
                </div>
            )}

        </article>
    );
};

export default NavBarContainer