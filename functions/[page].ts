import type { D1Database, EventContext, Fetcher } from "@cloudflare/workers-types";

interface ShortURLDatabaseResponse {
    original: string
}

export interface Env {
    DB: D1Database,
    ASSETS: Fetcher
}

enum ShortType {
    Normal,
    Secure,
    SanZi
}

function getTableName(type: ShortType) {
    switch (type) {
        case ShortType.Normal:
            return "links";
        case ShortType.Secure:
            return "private_short_link";
        case ShortType.SanZi:
            return "sanzi_official_short";
    }
}

export async function onRequest(context: EventContext<Env, string, Record<string, unknown>>) {
    const ln = context.params.page;
    const link = (ln instanceof Array ? ln[0] : ln);
    if (link.match("@react-refresh")) return context.env.ASSETS.fetch(context.request);

    let type = ShortType.Normal;
    if (link.startsWith("s:")) type = ShortType.Secure;
    if (link.startsWith("o:")) type = ShortType.SanZi;

    try {
        const result: ShortURLDatabaseResponse | null = await context.env.DB
            .prepare(`SELECT original FROM ${getTableName(type)} WHERE short = ? AND enabled = 1 AND (expire_at IS NULL OR expire_at > CURRENT_TIMESTAMP)`)
            .bind(link)
            .first();
        
        const url = new URL(context.request.url);
        const defaultPath = "".concat(url.protocol, "//", url.hostname);
        
        if (result === null) return Response.redirect(defaultPath, 302);
        if (type === ShortType.Secure) return Response.redirect(defaultPath.concat("/encryption/", link));

        if (type === ShortType.Normal) await context.env.DB
            .prepare("INSERT INTO analysis (`short_link`, `user_agent`, `access_ip`, `country_code`) VALUES (?, ?, ?, ?)")
            .bind(link, context.request.headers.get("user-agent"), context.request.headers.get('CF-Connecting-IP') || "0.0.0.0", context.request.cf?.country)
            .run();
        return Response.redirect(result.original, 302);
    } catch (e) {
        console.log(e);
        return new Response("Hi! NAP Shorter get an unexpected server error while getting the original URL of this short URL. If you want to submit this error, please email to service@nap.tw.", { status: 500 });
    }
}