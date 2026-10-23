import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className='md:h-[400px]  mb-auto min-h-[300px] items-center md:items-start flex flex-col gap-10 mt-20 text-white py-10 rounded-t-[45px] p-6 md:px-20 max-w-full sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1180px] mx-auto  bg-dark'>
            <div className='w-fit'>
                <Link href={"/"}>
                    <h3 className='text-3xl border-[#bec8ff] border-[1px]  rounded-3xl px-3.5 py-2.5 font-semibold flex items-center'><span className='font-bold text-4xl'>W</span>orkplace Compass</h3>
                </Link>
            </div>
            <div className='flex flex-col md:flex-row items-center gap-20'>
                <div className='flex flex-col gap-3'>
                    <h1 className='text-xl text-blue-200'>About Workplace Compass</h1>
                    <span>A local-first workplace scenario practice tool.</span>
                    <span>Transparent rubric-based learning feedback.</span>
                </div>
                {/* <div className='flex-1 h-full'>
                    <form className="bg-[#292A32] px-10 py-8 rounded-[14px] gap-5 h-full flex flex-col sm:flex-row items-center justify-center">
                        <div className="w-full sm:w-[55%]">
                            <input type="text" id="email" name="email" placeholder="Email" className="bg-transparent w-full px-[35px] py-5 border rounded-[14px] focus:outline-none" />
                        </div>
                        <button type="submit" name="submit" className="w-full bg-blue-200 p-5 cursor-pointer text-black rounded-2xl transition transition-normal  hover:text-white hover:bg-black sm:w-[45%] btn-tertiary">Subscribe to news</button>
                    </form>
                </div> */}
            </div>
            <hr />
            <div className='md:text-left text-center'>
                <span >Nexathon Workplace Assessment — local-first learning tool</span>
            </div>
        </footer>
    )
}

export default Footer