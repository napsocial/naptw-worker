import { useEffect, useRef, useState } from "react";
import Advantages from "./Advantages";
import Analysis from "./Analysis";
import useOnScreen from "@/Hooks/useOnScreen";

export default function Introduction() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const visible = useOnScreen(ref);

    useEffect(() => {
        if (isVisible) return;
        setIsVisible(visible);
    }, [visible, isVisible]);

    return <>
        <div className="w-full pb-10 bg-theme">
            <Advantages />
            <div ref={ref}>
                {isVisible && <Analysis />}
            </div>
        </div>
    </>;
}