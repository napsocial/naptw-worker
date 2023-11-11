import useTitle from "@/Hooks/useTitle";

export default function ServerError() {
    useTitle("Oops! In Trouble!")

    return <>

        <div className="">
            <h1 className="block text-8xl font-black w-fit mb-5">Sorry for That!</h1>
            <h2 className="block w-fit text-4xl">Our Server is In Exception Error!</h2>
        </div>
    </>;
}