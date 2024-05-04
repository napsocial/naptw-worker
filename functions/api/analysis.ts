import { DefaultRequest } from "../utils";

interface AllCounts {
    all_count: number
}

interface LinkCounts {
    all_count: number
}

interface CountryCounts {
    country_code: string,
    count: number
}

interface ShortLinkCounts {
    short_link: string,
    count: number
}

interface CountsResponse<T> {
    results: T[]
}

type DBResponse = [
    AllCounts | null,
    LinkCounts | null,
    CountsResponse<CountryCounts> | null,
    CountsResponse<ShortLinkCounts> | null
];

export async function onRequest(context: DefaultRequest) {
    const today = new Date();

    const [
        all_result,
        links_result,
        country_counts,
        short_counts
    ]: DBResponse = await Promise.all([
        context.env.DB
            .prepare("SELECT COUNT(*) as all_count FROM analysis")
            .first<AllCounts>(),
        context.env.DB
            .prepare("SELECT COUNT(*) as all_count FROM links WHERE strftime('%Y', timestamp) = ? AND strftime('%m', timestamp) + 0 = ? + 0")
            .bind(today.getFullYear().toString(), (today.getMonth() + 1).toString())
            .first<AllCounts>(),
        context.env.DB
            .prepare("SELECT country_code, COUNT(*) as count FROM analysis GROUP BY country_code ORDER BY COUNT(*) DESC LIMIT 5")
            .all<CountryCounts>(),
        context.env.DB
            .prepare("SELECT short_link, COUNT(*) as count FROM analysis GROUP BY short_link ORDER BY COUNT(*) DESC LIMIT 5")
            .all<ShortLinkCounts>()
    ]);
    
    return Response.json({
        links_count: links_result?.all_count,
        all_counts: all_result?.all_count,
        country_rank: country_counts.results,
        short_rank: short_counts.results
    });
}