import React from 'react';

const workplaceBenefits = [
    "Realistic Scenarios",
    "Rubric-Based Feedback",
    "Practical Next Steps",
    "Five Competency Areas",
    "Written Reflection",
    "Repeatable Practice",
    "Progress Tracking"
];


const vibrantColors = [
    'text-emerald-500', 
    'text-rose-500',    
    'text-amber-500',   
    'text-blue-600',   
    'text-fuchsia-500', 
    'text-purple-600',  
    'text-cyan-500',    
];


const SubBanner = () => {
    return (
        <section className='flex-wrap hidden md:flex justify-center gap-6 px-4 mt-10 md:mt-20'>
            {
                workplaceBenefits.map((item, index) => (
                    <span
                        key={index}
                        className={`text-xl text-center font-bold ${vibrantColors[index]} drop-shadow-md items-center hover:drop-shadow-xl hover:scale-110 hover:brightness-110 transition-all duration-500 ease-in-out px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer`}
                    >
                        {item}
                    </span>
                ))
            }
        </section>
    );
};

export default SubBanner;
