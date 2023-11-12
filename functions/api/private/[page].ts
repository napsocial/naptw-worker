import { APIErrorType, BotManagement, DefaultRequest, ErrorMessages, ServerStatus } from "../../utils";

interface PrivateDatabaseResponse {
    original: string,
    create_at: string,
    expire_at: string,
    key_hash: string,
    original_hash: string,
    create_user: string
}

export async function onRequestGet(context: DefaultRequest) {
    const ln = context.params.page;
    const link = (ln instanceof Array ? ln[0] : ln);

    if (!context.request.headers.get('Referer')?.match(new URL(context.request.url).hostname) ||
        (context.request.cf?.botManagement as BotManagement).score < 25)
        return new Response(ErrorMessages[APIErrorType.NoDirectAccess]);
    
    try {
        const result: PrivateDatabaseResponse | null = await context.env.DB
            .prepare(`SELECT original, create_at, expire_at, key_hash, original_hash, create_user FROM private_short_link WHERE short = ? AND enabled = 1 AND (expire_at IS NULL OR expire_at > CURRENT_TIMESTAMP)`)
            .bind(link)
            .first();
        
        if (result === null) return Response.json([ServerStatus.Error]);
        return Response.json([
            ServerStatus.CreateSuccess,
            result.create_at,
            result.expire_at,
            result.original,
            result.original_hash,
            result.key_hash,
            result.create_user
        ]);
    } catch (e) {
        console.log(e);
        return new Response(ErrorMessages[APIErrorType.ServerError], { status: 500 });
    }
}