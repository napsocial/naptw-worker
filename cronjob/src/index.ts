export interface Env {
    DB: D1Database,
    KV: KVNamespace
}

interface AllCounts {
    all_count: number
}

interface CountryCounts {
    country_code: string,
    count: number
}

type DBResponse = [
    AllCounts | null,
    AllCounts | null,
    CountryCounts | null
];

// TODO: Make records table
// interface AnalysisRecord {
// 	short_link: string,
// 	timestamp: Date,
// 	user_agent: string,
// 	access_ip: string,
// 	country_code: string
// }

export default {
    async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
        // Remove all expired records
        await Promise.all([
            env.DB.exec("DELETE FROM links WHERE expire_at <= CURRENT_TIMESTAMP"),
            env.DB.exec("DELETE FROM private_short_link WHERE expire_at <= CURRENT_TIMESTAMP")
        ]);

        const today = new Date();
        today.setMonth(today.getMonth() - 1);

        const counts: DBResponse = await Promise.all([
            env.DB
                .prepare("SELECT COUNT(*) as all_count FROM analysis WHERE strftime('%Y', timestamp) = ? AND strftime('%m', timestamp) + 0 = ? + 0")
                .bind(today.getFullYear().toString(), (today.getMonth() + 1).toString())
                .first<AllCounts>(),
            env.DB
                .prepare("SELECT COUNT(*) as all_count FROM links WHERE strftime('%Y', create_at) = ? AND strftime('%m', create_at) + 0 = ? + 0")
                .bind(today.getFullYear().toString(), (today.getMonth() + 1).toString())
                .first<AllCounts>(),
            env.DB
                .prepare("SELECT country_code, COUNT(*) as count FROM analysis GROUP BY country_code ORDER BY COUNT(*) DESC LIMIT 5")
                .first<CountryCounts>()
        ]);
        
        await Promise.all([
            env.KV.put("shorter::shortlinks::monthly_counts", (counts[0]?.all_count || 0).toString()),
            env.KV.put("shorter::shortlinks::monthly_links", (counts[1]?.all_count || 0).toString()),
            env.KV.put("shorter::shortlinks::country", (counts[2]?.country_code || "N/A") + ":" + (counts[2]?.count || 0))
        ]);
    },
};
