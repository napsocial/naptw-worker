import type { D1Database, EventContext } from "@cloudflare/workers-types";
import { ServerShortError, ServerStatus, generateRandomString, validateURL } from "../utils";

interface RequestData {
    ul: string,
    vf: string,
    ep?: number
}

export interface Env {
    DB: D1Database,
    TURNSTILE_KEY: string
}

export async function onRequestPost(context: EventContext<Env, string, Record<string, unknown>>) {
    if (context.request.headers.get('host') !== new URL(context.request.url).hostname ||
        context.request.cf?.botManagement.score < 25)
        return new Response("You cannot direct access this API. Try our API to create short link!");

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
    
    const short = generateRandomString(8);
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