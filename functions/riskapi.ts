import { Env } from './utils';

export const checkRisk = async (url: string, env: Env) => {
    let path = "https://webrisk.googleapis.com/v1/uris:search?uri=" + encodeURIComponent(url) + "&key=" + env.GOOGLE_API_KEY;
    const threatsTypes = [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "SOCIAL_ENGINEERING_EXTENDED_COVERAGE"
    ];

    path = path.concat("&threatTypes=", threatsTypes.join("&threatTypes="));

    const response = await fetch(path);
    const threat = await response.json();

    console.log(threat);

    if (threat && threat.threat && threat.threat.threatTypes && threat.threat.threatTypes.length > 0)
        return true;

    return false;
}