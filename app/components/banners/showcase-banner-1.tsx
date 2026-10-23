import React from 'react'


const containerItems = [
    {
        head: "Master Your",
        subhead: "Responses.",
        content: "Receive rubric-based feedback that highlights practical signals in your written response.",
        cardBgClass: "bg-gray",
        tagBgClass: "bg-blue-200",
        textClass: "text-dark",
    },
    {
        head: "Communicate with",
        subhead: "Confidence.",
        content: "Practise explaining your reasoning clearly, respectfully, and with concrete next steps.",
        cardBgClass: "bg-blue-200",
        tagBgClass: "bg-white",
        textClass: "text-dark",
    },
    {
        head: "Practice Real",
        subhead: "Scenarios.",
        content: "Work through realistic workplace situations involving colleagues, deadlines, and competing priorities.",
        cardBgClass: "bg-black",
        tagBgClass: "bg-white",
        textClass: "text-gray",
    },
    {
        head: "Refine Your",
        subhead: "Delivery.",
        content: "Improve the structure, clarity, and follow-through in your written workplace responses.",
        cardBgClass: "bg-gray",
        tagBgClass: "bg-blue-200",
        textClass: "text-dark",
    },
    {
        head: "Get Instant",
        subhead: "Insights.",
        content: "Review competency scores and track results across comparable completed assessments.",
        cardBgClass: "bg-blue-200",
        tagBgClass: "bg-white",
        textClass: "text-dark",
    },
    {
        head: "Ace Any",
        subhead: "Interview.",
        content: "Practise communication, teamwork, conflict resolution, ethical decisions, and prioritisation.",
        cardBgClass: "bg-black",
        tagBgClass: "bg-white",
        textClass: "text-gray",
    }
];


const ShowCaseBanner1 = () => {
    return (<>
        <article className=' pt-0 md:pt-10 pb-10'>
            <section className='flex flex-col md:flex-row justify-items-start gap-10 pt-12 pb-12 items-center'>
                <h3 className='w-fit blue-head text-center sm:text-left px-4 text-2xl sm:text-4xl'>Build Stronger Workplace Skills</h3>
                <p className='max-w-2/3 text-center'>Build workplace judgement through realistic scenarios, transparent scoring, actionable feedback, and repeatable practice.</p>
            </section>
            <section className='grid md:grid-cols-2 grid-cols-1 gap-10 items-center'>
                {
                    containerItems.map((item, index) => {
                        return <div key={index} className={`${item.cardBgClass} min-h-[260px] w-full flex flex-col gap-8 justify-items-start justify-around border-[1px] border-black border-b-8 p-10 rounded-4xl`}>
                            <h3 className="flex flex-col col-span-2 lg:col-span-1">
                                <span className={`w-[fit-content] ${item.tagBgClass} px-1.5 py-0.5 text-2xl rounded-sm`}>{item.head}</span>
                                <span className={`w-[fit-content] ${item.tagBgClass} px-1.5 py-0.5 text-2xl rounded-sm`}>{item.subhead}</span>
                            </h3>
                            <p className={`text-md text-base ${item.textClass} leading-relaxed align-bottom`}>
                                {item.content}
                            </p>
                        </div>
                    })
                }
            </section>
        </article>
    </>

    )
}

export default ShowCaseBanner1