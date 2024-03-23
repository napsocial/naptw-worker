import { FaTwitter, FaGithub, FaMastodon } from "react-icons/fa";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

export default function Footer() {
    return <>
        <div className={`w-full bg-gradient-to-b to-black py-96`.concat(location.pathname === "/" ? " from-theme" : " from-white")}></div>
        <footer className="bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-ft-bg-to via-black to-black align-bottom p-50">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8 px-5 sm:px-20">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <a href="https://about.nap.tw" className="flex flex-col items-start">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">The NAP Platform</span>
                            <span className="self-center text-sm text-slate-300">A SanZi Network Project</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase text-white">SanZi Network</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="https://sanzi.io" className="hover:underline">Home Page</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://status.sanzi.io" className="hover:underline">Status</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://nap.tw" className="hover:underline">NAP Shortener</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://nap.social" className="hover:underline">@nap.social</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://muisnowdevs.one" className="hover:underline">@Muisnow</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase text-white">Follow us</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="https://nap.social/@platform" className="hover:underline">Mastodon</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://twitter.com/napplatform" className="hover:underline">Twitter</a>
                                </li>
                                <li className="mb-4">
                                    <a href="https://github.com/thenapnetwork" className="hover:underline">Github</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold uppercase text-white">Legal</h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="/privacy" className="hover:underline">Privacy Policy</a>
                                </li>
                                <li className="mb-4">
                                    <a href="/terms" className="hover:underline">Terms of Service</a>
                                </li>
                                <li className="mb-4">
                                    <a href="/o:napTerms" className="hover:underline">NAP Shortener ToS</a>
                                </li>
                                <li className="mb-4">
                                    <a href="/o:napReport" className="hover:underline"><HiMiniArrowTopRightOnSquare className="inline" /> Report Violation</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-400 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between px-5">
                    <span className="text-sm text-gray-400 sm:text-center">© 2023 <a href="https://sanzi.io" className="hover:underline text-purple-400 font-bold">SanZi Network</a> and <a href="https://about.nap.tw" className="hover:underline text-purple-400 font-bold">The NAP Platform</a>.
                    </span>
                    <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
                        <a className="text-gray-400 hover:text-white" href="https://nap.social/@platform"><FaMastodon size={20} /></a>
                        <a className="text-gray-400 hover:text-white" href="https://github.com/thenapnetwork"><FaGithub size={20} /></a>
                        <a className="text-gray-400 hover:text-white" href="https://twitter.com/napplatform"><FaTwitter size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    </>;
}