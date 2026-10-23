"use client";

import { Fragment, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import Image from "next/image";
import React from 'react';
export default function LeaderBoard() {
    const [visibleIndex, setVisibleIndex] = useState(-1);

    useEffect(() => {
        const delays = [300, 600, 900]; 
        delays.forEach((delay, i) => {
            setTimeout(() => {
                setVisibleIndex((prev) => i);
            }, delay);
        });
    }, []);

    const items = [
        { label: 'yuvaraj 1', score: 2000, bg: '#1d243c', z: 'z-30', offset: '',imagepath:'gold-medal.png' },
        { label: 'yuvaraj 2', score: 1800, bg: '#5a5f7a', z: 'z-20', offset: '-mt-4', opacity: '/90',imagepath: 'silver-medal.png' },
        { label: 'yuvaraj 3', score: 900, bg: '#898da5', z: 'z-10', offset: '-mt-5', opacity: '/60', imagepath: 'bronze-medal.png' },
    ];

    return (
        <Card className="flex z-10 flex-col min-w-2xs min-h-[380px] h-full bg-white/60 rounded-4xl select-none">
            <React.Fragment>
                <CardHeader className="items-center pb-0">
                    <CardTitle>Leader Boards</CardTitle>
                </CardHeader>
                <CardContent className="items-center flex justify-center blur-xs flex-col px-8">
                    {items.map((item, index) => (
                        <div
                            key={item.label}
                            className={`relative ${item.z} p-6 flex items-end flex-row rounded-4xl text-white text-xl transition-all duration-500 ease-out transform
                        ${item.offset}
                        ${visibleIndex >= index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                 `}
                            style={{ backgroundColor: item.bg }}
                        >
                            <span className="p-2">{item.label}</span>
                            <span className="p-2 font-bold">{item.score}</span>
                            <Image src={`/${item.imagepath}`} className='self-end' width={50} height={50} alt='gold-medal'></Image>
                        </div>
                    ))}
                </CardContent>
            </React.Fragment>
            
        </Card>
    );
}
