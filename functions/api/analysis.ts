import { DefaultRequest } from "../utils";

type DBResponse = [
    string | null,
    string | null,
    string | null,
];

export async function onRequest(context: DefaultRequest) {
    const [
        all_result,
        links_result,
        country_counts
    ]: DBResponse = await Promise.all([
        context.env.KV.get("shorter::shortlinks::monthly_links"),
        context.env.KV.get("shorter::shortlinks::monthly_counts"),
        context.env.KV.get("shorter::shortlinks::country")
    ]);
    
    return Response.json({
        links_count: all_result,
        all_counts: links_result,
        country_rank: country_counts,
    });
}