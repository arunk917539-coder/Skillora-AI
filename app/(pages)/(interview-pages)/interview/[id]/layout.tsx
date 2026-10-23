
import UserProfileIcon from "@/app/components/auth/user-profile-icon";
import "../../../../globals.css";
import type { Metadata } from "next";
import Provider from "@/app/provider";



export const metadata: Metadata = {
  title: 'Workplace Compass | Assessment',
  description: 'Complete a workplace scenario assessment and review your development feedback.',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="gradient h-screen w-full">
        <div className="relative h-full w-full">

          <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[10%] translate-y-[20%] bg-[#5a5f7a] brightness-200 rounded-full opacity-50 blur-[80px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[220%] translate-y-[30%] bg-[#5a5f7a] brightness-200 rounded-full opacity-50 blur-[80px]" />

          <div className="w-full max-h-screen px-4 sm:px-6 md:px-8
                                    max-w-full sm:max-w-[540px] md:max-w-[720px]
                                    lg:max-w-[960px] xl:max-w-[1280px] mx-auto
                                    ">
            <div className='pt-10 pb-5 hidden lg:flex items-center flex-row justify-between z-10'>
              <h3 className='text-3xl hover:bg-green border-[1px] border-black rounded-3xl px-3 py-2.5 font-semibold flex items-center'><span className='font-bold text-4xl'>W</span>orkplace Compass</h3>
              {/* <UserProfileIcon isOptionEnabled={false} /> */}
            </div>
            <Provider>
              {children}
            </Provider>
          </div>
        </div>
      </body>
    </html>
  )
}
