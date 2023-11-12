import { APIErrorType, BotManagement, DefaultRequest, ErrorMessages, ServerShortError, ServerStatus, generateRandomString } from "../utils";

interface RequestData {
    ul: string,         // Encrypted Original URL
    vf: string,         // Turnstile Token
    ep: number,         // Expire Timestamp
    ho: string,         // Original Hash
    hk: string          // Key Hash
}

export async function onRequestPost(context: DefaultRequest) {
    if (!context.request.headers.get('Referer')?.match(new URL(context.request.url).hostname) ||
        (context.request.cf?.botManagement as BotManagement).score < 25)
        return new Response(ErrorMessages[APIErrorType.NoDirectAccess]);

    const request: RequestData = await context.request.json();
    const ip = context.request.headers.get('CF-Connecting-IP') || "0.0.0.0";

    if (!request.ul || !request.vf || !request.ep || !request.hk || !request.ho)
        return Response.json([
            ServerStatus.Error,
            ServerShortError.RequirementsNotMet
        ]);

    const form = new FormData();
    form.append("secret", context.env.TURNSTILE_KEY);
    form.append('response', request.vf);
    form.append('remoteip', ip);

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        body: form,
        method: "POST"
    });
    if (!(await result.json()).success)
        return Response.json([
            ServerStatus.Error,
            ServerShortError.TurnsileNotPass
        ]);

    const short = generateRandomString(8);
    const expire = new Date(request.ep).toISOString();
    await context.env.DB
        .prepare("INSERT INTO private_short_link (`short`, `original`, `create_ip`, `expire_at`, `create_user`, `key_hash`, `original_hash`) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(short, request.ul, ip, expire, null, request.hk, request.ho)
        .run();

    return Response.json([
        ServerStatus.CreateSuccess,
        short,
        ip,
        expire,
        null
    ]);
}