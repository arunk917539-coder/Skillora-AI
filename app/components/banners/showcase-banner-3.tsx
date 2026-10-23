"use client";


import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import Image from "next/image";


const workplaceTips = [
    {
        head: "Respond to Workplace Pressure",
        subhead: "Tight deadlines and difficult conversations can make it harder to think clearly. Use realistic practice scenarios to plan a response, explain your reasoning, and identify a next step."
    },
    {
        head: "Navigate Difficult Situations",
        subhead: "Workplace situations rarely have one perfect answer. Practise considering risks, listening to affected colleagues, and choosing a fair, practical course of action."
    },
    {
        head: "Understand Your Competency Signals",
        subhead: "Review rubric-based indicators for communication, collaboration, problem solving, accountability, and planning. The feedback is a learning aid, not a validated psychological or employment assessment."
    },
    {
        head: "Build a Repeatable Practice Habit",
        subhead: "Complete short assessments when convenient, review your development activities, and try another comparable scenario to reflect on your progress."
    },
    {
        head: "Turn Feedback into Action",
        subhead: "Each competency area can suggest concrete practice activities, such as clarifying shared understanding, considering trade-offs, and confirming ownership and follow-up."
    }
];


const ShowcaseBanner3 = () => {

    const [selected, setSelected] = useState<Record<string, boolean>>({});



    const selectAccordion = (id: string) => {
        setSelected((prev) => {

            if (prev[id]) {
                return {
                    ...prev,
                    [id]: !prev[id]
                }
            }

            for (const key in prev) {
                prev[key] = false;
            }

            return {
                ...prev,
                [id]: !prev[id]
            }

        });
    };

    return (
        <article className='pb-10'>
            <section className='flex flex-col md:flex-row justify-items-start gap-10 pt-12 pb-12 items-center'>
                <h3 className='w-fit blue-head text-center sm:text-left px-4 text-2xl sm:text-4xl'>How Workplace Compass Helps You Practise
                </h3>
                <p className='max-w-2/3'>Practise workplace decisions, understand rubric signals, and use development suggestions to guide your next attempt.</p>
            </section>
            <section>
                <Accordion type="single" className='flex flex-col gap-10' collapsible>
                    {
                        workplaceTips.map((item, index) => {
                            return <AccordionItem className='border-0' onClick={() => selectAccordion(index.toString())} key={index} value={`item-${index}`}>
                                <AccordionTrigger className={` transition-all duration-400 border-[1px]  ${selected[index.toString()] ? "border-black  rounded-[45px] border-2 rounded-b-none border-b-0 bg-blue-200 " : "bg-gray  rounded-[45px]  border-b-8 border-black "}  items-center overflow-hidden  h-[160px] ${index % 2 ? "justify-end" : "justify-start"}  p-10 w-full `}>
                                    <div className='flex items-center gap-3'>
                                        <span className='text-6xl'>0{index + 1}</span>
                                        {item.head}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className={`bg-blue-200 p-5 rounded-[45px] border-[1px] border-black ${selected[index.toString()] && "border-b-8 rounded-none rounded-b-[45px]"}`}>
                                    {item.subhead}
                                </AccordionContent>
                            </AccordionItem>
                        })
                    }

                </Accordion>



            </section>
        </article>
    )
}

export default ShowcaseBanner3