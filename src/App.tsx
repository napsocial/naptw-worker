import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import RouteHandler from "@/RouteHandler";

console.log("It appears that you have an interest in the NAP Shortener source code, if you can decrypt the following encrypted content, it is not impossible for you to join The NAP Platform's team!")
console.log("RcjoIuJMwy+5mb6Wd+EK6RtGZdGsayFvIE4WSWf7+VG1wGD1BxYTDMwXFEzef54e24fa00e6a47035cabf614dc819a3c0c3");
console.log("REMEMBER! It is not as difficult as you think! More easier you think, the more possible you solve it!");

export default function App() {
    return <>
        <Header />
        <div className="flex relative min-h-[calc(100vh-7rem)] m-auto justify-center items-center flex-col">
            <RouteHandler />
        </div>
        <Footer />
    </>
}