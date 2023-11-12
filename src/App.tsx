import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import RouteHandler from "@/RouteHandler";

console.log("RcjoIuJMwy+5mb6Wd+EK6RtGZdGsayFvIE4WSWf7+VG1wGD1BxYTDMwXFEzef54e24fa00e6a47035cabf614dc819a3c0c3");

export default function App() {
    return <>
        <Header />
        <div className="flex relative min-h-[calc(100vh-7rem)] w-4/5 m-auto justify-center items-center flex-col">
            <RouteHandler />
        </div>
        <Footer />
    </>
}