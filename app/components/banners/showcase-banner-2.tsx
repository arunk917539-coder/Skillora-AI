import React from 'react'
import Image from "next/image";

const ShowcaseBanner2 = () => {
    return (
        <article className="bg-gray-100  h-full relative flex flex-col lg:flex-row items-center justify-between p-10 mt-20 mb-20 rounded-[45px] gap-10">
            <section className="flex flex-col gap-6 items-center xl:items-baseline xl:max-w-[70%]">
                <h3 className="text-3xl sm:text-4xl text-center md:text-left font-semibold text-black">
                    Reflect. Improve. Practise Again.
                </h3>
                <p className="text-base text-center xl:text-left sm:text-lg text-gray-700 leading-relaxed">
                    Work through realistic workplace scenarios, review your competency signals, and receive practical suggestions for your next attempt. Workplace Compass uses a local Ollama model to generate rubric-guided practice feedback. AI results may be imperfect and are not validated employment measurements.
                </p>
            </section>
            <Image
                src="/banner-img2.svg"
                height={200}
                width={400}
                className="object-contain -translate-x-1/2 left-[85%] hidden xl:block absolute w-[380px] h-auto"
                alt="Workplace assessment illustration"
            />

        </article>
    )
}

export default ShowcaseBanner2