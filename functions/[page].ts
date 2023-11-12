import { APIErrorType, DefaultRequest, ErrorMessages, ShortURLDatabaseResponse } from "./utils";

enum ShortType {
    Normal,
    Secure,
    SanZi
}
interface ShortString {
    type: ShortType,
    short: string
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

function getTypeShort(link: string): ShortString {
    if (link.startsWith("s:")) return { type: ShortType.Secure, short: link.split(":")[1] };
    if (link.startsWith("o:")) return { type: ShortType.SanZi, short: link.split(":")[1] };

    return { type: ShortType.Normal, short: link };
}

export async function onRequest(context: DefaultRequest) {
    const ln = context.params.page;
    const link = (ln instanceof Array ? ln[0] : ln);
    if (["@react-refresh", "favicon.ico", "robots.txt"].some((val) => link.match(val))) return context.env.ASSETS.fetch(context.request);

    try {
        const shortType = getTypeShort(link);

        let SQL = `SELECT original FROM ${getTableName(shortType.type)} WHERE short = ? AND enabled = 1 AND (expire_at IS NULL OR expire_at > CURRENT_TIMESTAMP)`;
        if (shortType.type === ShortType.SanZi) SQL = `SELECT original FROM ${getTableName(shortType.type)} WHERE short = ? AND enabled = 1`;
        const result: ShortURLDatabaseResponse | null = await context.env.DB
            .prepare(SQL)
            .bind(shortType.short)
            .first();
        
        const url = new URL(context.request.url);
        const defaultPath = "".concat(url.protocol, "//", url.hostname);
        
        if (result === null) return Response.redirect(defaultPath, 302);
        if (shortType.type === ShortType.Secure) return Response.redirect(defaultPath.concat("/encryption/", shortType.short));

        if (shortType.type === ShortType.Normal) await context.env.DB
            .prepare("INSERT INTO analysis (`short_link`, `user_agent`, `access_ip`, `country_code`) VALUES (?, ?, ?, ?)")
            .bind(link, context.request.headers.get("user-agent"), context.request.headers.get('CF-Connecting-IP') || "0.0.0.0", context.request.cf?.country)
            .run();
        return Response.redirect(result.original, 302);
    } catch (e) {
        console.log(e);
        return new Response(ErrorMessages[APIErrorType.ServerError], { status: 500 });
    }
}