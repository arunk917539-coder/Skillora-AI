import Link from "next/link";
import { auth } from "../../(auth-pages)/auth";
import UserProfileIcon from "../auth/user-profile-icon";

const NavBar = async () => {
    let Session = null;
    try {
        Session = await auth();
    } catch {
        // Defensive: stale or invalid session cookies will not crash the landing page
        Session = null;
    }

    return (
        <header className='px-4 sm:px-6 md:px-8 max-w-full sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1280px] mx-auto h-24 w-full sticky top-0 z-100 bg-white  items-center flex justify-between'>
            <div className="mr-auto">
                <Link href={"/"}>
                    <h3 className='text-xl md:text-3xl hover:bg-[#bec8ff] border-[1px] border-black rounded-3xl px-3 py-2.5 font-semibold flex items-center'><span className='font-bold text-xl md:text-4xl'>W</span>orkplace Compass</h3>
                </Link>
            </div>
            <div className="flex items-center gap-4 md:gap-10 flex-row">
                {
                    !Session &&
                    <>
                        <Link href={"/login"} >
                            <div className="nav-btn">
                                Sign in
                            </div>
                        </Link>
                        <Link href={"/signup"} >
                            <div className="nav-btn">
                                Sign up
                            </div>
                        </Link>
                    </>
                }
                {
                    Session &&
                    <>
                        <Link href={"/dashboard"} className="nav-btn">Dashboard</Link>
                        <UserProfileIcon isOptionEnabled={true} />
                    </>
                }
            </div>

        </header>
    )
}

export default NavBar
