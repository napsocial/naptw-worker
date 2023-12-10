import ReactCountryFlag from "react-country-flag";
import useFetch from "@/Hooks/useFetch";
import { formatNumberToBig } from "@/utils";

interface AnalysisResponse {
    links_count:  number;
    all_counts:   number;
    country_rank: CountryRank[];
    short_rank:   ShortRank[];
}

interface CountryRank {
    country_code: null | string;
    count:        number;
}

interface ShortRank {
    short_link: string;
    count:      number;
}

const IntroText = ({ children }: { children: (string | JSX.Element)[] }) => <h1 className="text-3xl sm:text-4xl font-bold ms:max-w-lg m-5 flex-auto rounded-lg shadow-lg p-5">
    {children}
</h1>

export default function Analysis() {
    const data = useFetch<AnalysisResponse>("/api/analysis");

    return <div className="bg-theme w-full min-h-screen md:w-4/5 m-auto">
        <div className="text-white m-auto px-5 md:px-0 mb-10 mt-5 flex justify-end">
            <span className="text-5xl font-bold w-fit leading-tight">當然 我們也提供<span className="bg-indigo-600 px-2 mx-2">公開數據</span>！</span>
        </div>
        <div className="bg-white p-5 m-5 rounded-xl">
            <div className="flex flex-wrap">
                <IntroText>NAP短網址服務上一共有<span className="block text-orange-500 text-5xl sm:text-8xl bg-gray-200 m-3 rounded-lg px-3 text-right py-2">{data && formatNumberToBig(data.links_count)}</span>個短網址！</IntroText>
                <IntroText>短網址一共被點擊<span className="block text-orange-500 text-5xl sm:text-8xl bg-gray-200 m-3 rounded-lg px-3 text-right py-2">{data && formatNumberToBig(data.all_counts)}</span>次！</IntroText>
                <IntroText>最多點擊次數的國家<span className="flex justify-end items-center text-orange-500 text-5xl sm:text-8xl bg-gray-200 m-3 rounded-lg px-3 text-right py-2">{data && <>
                    <ReactCountryFlag
                        className="mx-5 w-4 h-full rounded-lg"
                        style={{ height: "unset" }}
                        svg
                        countryCode={data.country_rank[0].country_code} />
                    {data.country_rank[0].country_code}
                </>}</span></IntroText>
            </div>
            <p className="text-gray-500 text-right">*這是我們自創建以來的數據，有可能會因為資料結構不同而實際有所差異。</p>
        </div>
    </div>;
}