import useTitle from "@/Hooks/useTitle";

export default function NotFound() {
    useTitle("Page Not Found!");

    return <>
        <div className="">
            <h1 className="block text-8xl font-black w-fit mb-5">Sorry for That!</h1>
            <h2 className="block w-fit text-4xl">We Cannot Found What You Want!</h2>
        </div>
    </>;
}