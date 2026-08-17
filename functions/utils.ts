import {
    D1Database,
    EventContext,
    Fetcher,
    IncomingRequestCfPropertiesBotManagementBase,
    KVNamespace,
    Request,
} from "@cloudflare/workers-types";

export const enum ServerStatus {
    CreateSuccess = 1 << 1,
    Error = -1,
}

export const enum ServerShortError {
    URLNotValid = 1 << 0,
    CustomLinkNotValid = 1 << 1,
    Duplicate = 1 << 2,
    NeedLogin = 1 << 3,
    TurnsileNotPass = 1 << 4,
    URLNotFound = 1 << 5,
    RequirementsNotMet = 1 << 6,
    URLBlocked = 1 << 7,
}

export type DefaultRequest = EventContext<Env, string, Record<string, unknown>>;
export type BotManagement = IncomingRequestCfPropertiesBotManagementBase;
export interface Env {
    DB: D1Database;
    KV: KVNamespace;
    TURNSTILE_KEY: string;
    ASSETS: Fetcher;
    SERVICE_ACCOUNT: string;
    GOOGLE_API_KEY: string;
}

export interface ShortURLDatabaseResponse {
    original: string;
}

export const enum APIErrorType {
    NoDirectAccess,
    ServerError,
}

export const ErrorMessages = {
    [APIErrorType.NoDirectAccess]:
        "You cannot direct access this API. Try our API to create short link!",
    [APIErrorType.ServerError]:
        "Hi!\n\nNAP Shorter get an unexpected server error while getting the original URL of this short URL.\nIf you want to submit this error, please email to service@nap.tw.\n\nYou can contact The NAP Platform's Developers with this request ID: {request_id}",
};

export interface ServiceAccountJSON {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
}

export const validateURL = (url: string): boolean => /https?:\/\/.+/.test(url);

export const generateRandomString = (length: number): string => {
    let result = "";
    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const charactersLength = characters.length;
    const randomValues = new Uint8Array(charactersLength);

    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += characters[randomValues[i] % charactersLength];
    }
    return result;
};

export const getRequestDefaultPath = (request: Request) => {
    const url = new URL(request.url);
    return "".concat(url.protocol, "//", url.host);
};

export const getServiceAccount = (env: Env) => {
    return JSON.parse(env.SERVICE_ACCOUNT) as ServiceAccountJSON;
};
