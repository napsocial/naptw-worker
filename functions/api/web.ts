import { isCAPTCHAFailed, isURLBlocked, isURLRisky } from "../riskapi";
import {
    APIErrorType,
    BotManagement,
    DefaultRequest,
    ErrorMessages,
    ServerShortError,
    ServerStatus,
    generateRandomString,
    validateURL,
} from "../utils";

interface RequestData {
    ul: string; // Original URL
    vf: string; // Turnstile Token
    ep?: number; // Expire Timestamp (optional)
}

export async function onRequestPost(context: DefaultRequest) {
    if (
        !context.request.headers
            .get("Referer")
            ?.match(new URL(context.request.url).hostname) ||
        (context.request.cf?.botManagement as BotManagement).score < 25
    )
        return new Response(ErrorMessages[APIErrorType.NoDirectAccess]);

    const request: RequestData = await context.request.json();
    const ip = context.request.headers.get("CF-Connecting-IP") || "0.0.0.0";

    if (!validateURL(request.ul))
        return Response.json([
            ServerStatus.Error,
            ServerShortError.URLNotValid,
        ]);

    if (!request.ul || !request.vf)
        return Response.json([
            ServerStatus.Error,
            ServerShortError.RequirementsNotMet,
        ]);

    const result = await Promise.all([
        isCAPTCHAFailed(request.vf, ip, context.env),
        isURLBlocked(request.ul, context.env.DB),
        isURLRisky(request.ul, context.env),
    ]);

    for (const risk of result) {
        if (!risk.blocked) continue;
        return Response.json([
            ServerStatus.Error,
            ServerShortError.URLBlocked,
            risk.reason,
            risk.timestamp
                ? new Date(risk.timestamp).toISOString()
                : new Date().toISOString(),
        ]);
    }

    const short = generateRandomString(5);
    const expire = (request.ep && new Date(request.ep).toISOString()) ?? null;
    await context.env.DB.prepare(
        "INSERT INTO links (`short`, `original`, `create_ip`, `expire_at`, `create_user`) VALUES (?, ?, ?, ?, ?)",
    )
        .bind(short, request.ul, ip, expire, null)
        .run();

    return Response.json([ServerStatus.CreateSuccess, short, ip, expire, null]);
}
