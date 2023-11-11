import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import RouteHandler from "@/RouteHandler";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";

console.log("RcjoIuJMwy+5mb6Wd+EK6RtGZdGsayFvIE4WSWf7+VG1wGD1BxYTDMwXFEzef54e24fa00e6a47035cabf614dc819a3c0c3");

export default function App() {
    const ga = !location.pathname.match("encryption") && "G-MSENQ0VVLY";
    // const { ga } = usePage<PageConfig>().props;
    const [, setShowAlert] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => setShowAlert(false), 4000);
        if (ga) ReactGA.initialize(ga);
    }, []);

    return <>
        <Header />
        <div className="flex relative min-h-[calc(100vh-7rem)] w-4/5 m-auto justify-center items-center flex-col">
            <RouteHandler />
        </div>
        <Footer />
    </>
}