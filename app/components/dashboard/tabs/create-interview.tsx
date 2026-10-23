import React from 'react'
import CreateInterviewForm from '../create-interview-form'
import Image from "next/image";

const CreateInterviewTab = () => {
  return (
    <div className="flex items-center bg-white/60 z-10 p-5 rounded-4xl flex-1 w-full gap-10 justify-around">
      <CreateInterviewForm />
      <Image src={"/typing-bro.svg"} className='hidden lg:block z-100 w-full min-w-xs max-w-md ' height={360} width={360} alt='typing'></Image>
    </div>
  )
}

export default CreateInterviewTab