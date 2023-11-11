// Page should be modify in App\Utils
export const enum ServerPage {
    Home              = 0,
    PrivateDecryption = 1,
    NotFound          = -1,
    ServerError       = -2,
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

// From https://stackoverflow.com/a/1349426
// Always be useful
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

// URL validater from https://dev.to/davidemaye/how-to-validate-urls-in-javascript-adm
// Might be useful
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