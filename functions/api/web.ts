import { checkRisk } from "../riskapi";
import { APIErrorType, BotManagement, DefaultRequest, ErrorMessages, ServerShortError, ServerStatus, generateRandomString, validateURL } from "../utils";

interface RequestData {
    ul: string,         // Original URL
    vf: string,         // Turnstile Token
    ep?: number         // Expire Timestamp (optional)
}

interface URLBlock {
    reason: string,
    timestamp: string
}

export async function onRequestPost(context: DefaultRequest) {
    if (!context.request.headers.get('Referer')?.match(new URL(context.request.url).hostname) ||
        (context.request.cf?.botManagement as BotManagement).score < 25)
        return new Response(ErrorMessages[APIErrorType.NoDirectAccess]);

    const request: RequestData = await context.request.json();
    const ip = context.request.headers.get('CF-Connecting-IP') || "0.0.0.0";

    if (!request.ul || !request.vf)
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
    
    if (!validateURL(request.ul))
        return Response.json([
            ServerStatus.Error,
            ServerShortError.URLNotValid
        ]);
    
    const url = new URL(request.ul);
    
    const url_blocked: URLBlock | null = await context.env.DB
        .prepare("SELECT reason, timestamp FROM block_list WHERE (domain = ? OR domain = ?) AND enabled = 1")
        .bind(url.hostname, url.hostname.split(".").slice(-2).join("."))
        .first();
    
    if (url_blocked)
        return Response.json([
            ServerStatus.Error,
            ServerShortError.URLBlocked,
            url_blocked.reason,
            url_blocked.timestamp
        ]);
    
    // check risk
    const risk = await checkRisk(request.ul, context.env);
    if (risk)
        return Response.json([
            ServerStatus.Error,
            ServerShortError.URLBlocked,
            "This URL is UNTRUSTABLE by our system. It may contain malware, phishing, or unwanted software. If you think this is a mistake, please contact us.",
            new Date().toISOString()
        ]);
    
    const short = generateRandomString(5);
    const expire = (request.ep && new Date(request.ep).toISOString()) ?? null;
    await context.env.DB
        .prepare("INSERT INTO links (`short`, `original`, `create_ip`, `expire_at`, `create_user`) VALUES (?, ?, ?, ?, ?)")
        .bind(short, request.ul, ip, expire, null)
        .run();

    return Response.json([
        ServerStatus.CreateSuccess,
        short,
        ip,
        expire,
        null
    ]);
}