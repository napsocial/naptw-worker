import { D1Database } from "@cloudflare/workers-types";
import { Env } from "./utils";

export type ScanResult =
    { blocked: false } | { blocked: true; reason: string; timestamp?: number };

interface URLBlock {
    reason: string;
    timestamp: string;
}

export const isURLRisky = async (
    url: string,
    env: Env,
): Promise<ScanResult> => {
    let path =
        "https://webrisk.googleapis.com/v1/uris:search?uri=" +
        encodeURIComponent(url) +
        "&key=" +
        env.GOOGLE_API_KEY;
    const threatsTypes = [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "SOCIAL_ENGINEERING_EXTENDED_COVERAGE",
    ];

    path = path.concat("&threatTypes=", threatsTypes.join("&threatTypes="));

    const response = await fetch(path);
    const threat = await response.json();

    console.log(threat);

    if (
        threat &&
        threat.threat &&
        threat.threat.threatTypes &&
        threat.threat.threatTypes.length > 0
    )
        return {
            blocked: true,
            reason: "Our system detected unusual activity from this URL. It may contain malware, phishing, or unwanted software.",
            timestamp: Date.now(),
        };

    return { blocked: false };
};

export const isCAPTCHAFailed = async (
    token: string,
    ip: string,
    env: Env,
): Promise<ScanResult> => {
    const form = new FormData();
    form.append("secret", env.TURNSTILE_KEY);
    form.append("response", token);
    form.append("remoteip", ip);

    const result = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            body: form,
            method: "POST",
        },
    );

    if (!(await result.json()).success)
        return {
            blocked: true,
            reason: "You didn't passed the CAPTCHA. Please try again later.",
        };

    return { blocked: false };
};

export const isURLBlocked = async (
    url: string,
    database: D1Database,
): Promise<ScanResult> => {
    const u = new URL(url);

    const url_blocked: URLBlock | null = await database
        .prepare(
            "SELECT reason, timestamp FROM block_list WHERE (domain = ? OR domain = ?) AND enabled = 1",
        )
        .bind(u.hostname, u.hostname.split(".").slice(-2).join("."))
        .first();

    if (url_blocked)
        return {
            blocked: true,
            reason: url_blocked.reason,
            timestamp: new Date(url_blocked.timestamp).getTime(),
        };

    return { blocked: false };
};
