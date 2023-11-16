
import SecoreIntroduction from "./SecureIntroduction";
import ServerIntroduction from "./ServerIntroduction";
import ShortIntroduction from "./ShortIntroduction";

export default function Introduction() {
    return <div className="bg-theme w-full min-h-screen flex justify-center flex-col">
        <div>
            <div className="text-white m-auto px-5 md:px-0 md:w-4/5 mb-10 mt-5">
                <span className="text-5xl font-bold w-fit">我們的三大優勢！</span>
            </div>
            <div className="w-full flex justify-center flex-wrap">
                <ShortIntroduction />
                <ServerIntroduction />
                <SecoreIntroduction />
            </div>
        </div>
    </div>;
}