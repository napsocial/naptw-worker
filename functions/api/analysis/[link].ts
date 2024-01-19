import { DefaultRequest } from "../../utils";

enum ErrorCode {
    NotFound   = 1 << 0,
    NotSupport = 1 << 1,
}

export async function onRequest(context: DefaultRequest) {
    const ln = context.params.link;
    const link = (ln instanceof Array ? ln[0] : ln);

    if (["s:", "o:"].some((val) => link.startsWith(val))) return Response.json({
        success: false,
        message: "Private Short Link or Official Short Link don't support analysis report.",
        ERR_CODE: ErrorCode.NotSupport
    }, { status: 400 });

    const db = await context.env.DB
        .prepare([
            "SELECT  COUNT(*) as count,",
                    "links.original,",
                    "links.create_at,",
                    "links.expire_at,",
                    "links.create_user,",
                    "links.enabled",
            "FROM    links",
            "INNER JOIN analysis",
            "ON links.short = analysis.short_link",
            "WHERE links.short = ?",
            "GROUP BY links.short, analysis.short_link"].join(" "))
        .bind(link)
        .first();
    
    if (!db) return Response.json({
        success: false,
        message: "Cannot find the short link you want.",
        ERR_CODE: ErrorCode.NotFound
    }, { status: 404 });
    
    return Response.json({
        success: true,
        ...db
    });
}