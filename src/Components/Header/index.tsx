/// <reference types="vite-plugin-svgr/client" />
import Logo from "@/Components/Images/Logo.svg?react";

import "./index.css";

export default function Header() {
    return <>
        <header className="flex w-full h-28 align-middle justify-center py-4 top-0 sticky bg-white/60 backdrop-blur-md z-[99999999]">
            <div className="flex w-4/5 items-center">
                <div className="flex justify-between items-center">
                    <div className="flex flex-row items-center">
                        <Logo className="w-16 h-16 sm:w-20 sm:h-20 mr-3" />
                        <div className="brand">
                            <span className="hidden sm:block text-2xl sm:text-4xl font-black mb-1 hover:cursor-default">小睡一下短網址服務</span>
                            <span className="block sm:hidden text-2xl sm:text-4xl font-black mb-1 hover:cursor-default">睡一下短網址</span>
                            <span className="block text-white bg-black px-1 max-w-max transition"><a className="text-white" href="https://nap.tw">The NAP Platform</a></span>
                        </div>
                    </div>
                    
                    <div className="account">

                    </div>
                </div>
            </div>
        </header>
    </>;
}