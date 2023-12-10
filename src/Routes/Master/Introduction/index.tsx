import Advantages from "./Advantages";
import Analysis from "./Analysis";

export default function Introduction() {
    return <>
        <div className="w-full pb-10 bg-theme">
            <Advantages />
            <Analysis />
        </div>
        <div className="w-full bg-gradient-to-b from-theme to-black py-96"></div>
    </>;
}