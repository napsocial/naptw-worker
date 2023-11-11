import { D1Database, EventContext, Fetcher } from "@cloudflare/workers-types";

export const enum ServerStatus {
    CreateSuccess = 1 << 1,
    Error         = -1,
}

export const enum ServerShortError {
    URLNotValid        = 1 << 0,
    CustomLinkNotValid = 1 << 1,
    Duplicate          = 1 << 2,
    NeedLogin          = 1 << 3,
    TurnsileNotPass    = 1 << 4,
    URLNotFound        = 1 << 5,
    RequirementsNotMet = 1 << 6,
}

export type DefaultRequest = EventContext<Env, string, Record<string, unknown>>;
export interface Env {
    DB: D1Database,
    TURNSTILE_KEY: string,
    ASSETS: Fetcher
}

export interface ShortURLDatabaseResponse {
    original: string
}

export const enum APIErrorType {
    NoDirectAccess,
    ServerError
}

export const ErrorMessages = {
    [APIErrorType.NoDirectAccess]: "You cannot direct access this API. Try our API to create short link!",
    [APIErrorType.ServerError]: "Hi! NAP Shorter get an unexpected server error while getting the original URL of this short URL. If you want to submit this error, please email to service@nap.tw."
}

export const validateURL = (url: string): boolean => {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i'
    );
    return pattern.test(url);
}

export const generateRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}