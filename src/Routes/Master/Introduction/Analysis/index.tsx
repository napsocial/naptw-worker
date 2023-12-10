import useFetch from "@/Hooks/useFetch";

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

export default function Analysis() {
    const data = useFetch<AnalysisResponse>("/api/analysis");

    return <div className="bg-theme w-full min-h-screen md:w-4/5 m-auto">
        <div className="text-white m-auto px-5 md:px-0 mb-10 mt-5 flex justify-end">
            <span className="text-5xl font-bold w-fit">當然 我們也提供<span className="bg-indigo-600 px-2 mx-2">公開數據</span>！</span>
        </div>
        <div className="bg-white p-5 m-5 rounded-xl">
            <div className="flex flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-bold ms:max-w-lg m-5 flex-auto rounded-lg shadow-lg p-5">NAP短網址服務上一共有<span className="block text-orange-500 text-4xl sm:text-8xl bg-gray-200 m-3 rounded-lg px-3 text-right">{data && data.links_count.toLocaleString()}</span>個短網址！</h1>
                <h1 className="text-3xl sm:text-4xl font-bold ms:max-w-lg m-5 flex-auto rounded-lg shadow-lg p-5">短網址一共被點擊<span className="block text-orange-500 text-4xl sm:text-8xl bg-gray-200 m-3 rounded-lg px-3 text-right">{data && data.all_counts.toLocaleString()}</span>次！</h1>
                <h1 className="text-3xl sm:text-4xl font-bold ms:max-w-lg m-5 flex-auto rounded-lg shadow-lg p-5">最多點擊次數的國家<span className="block text-orange-500 text-4xl sm:text-8xl bg-gray-200 m-3 rounded-lg px-3 text-right">{data && data.country_rank[0].country_code}</span></h1>
            </div>
        </div>
    </div>;
}