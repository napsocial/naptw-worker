export const enum ServerStatus {
    CreateSuccess = 1 << 1,
    Error         = -1,
}

export const enum Status {
    Default,
    CreatePrivate,
    URLLookUp,
    Creating,
    CreateSuccessful,
    Error
}