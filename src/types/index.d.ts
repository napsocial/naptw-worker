import { ServerPage } from "@/utils";
import { PageProps, ErrorBag, Errors } from "@inertiajs/core";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface PageConfig extends PageProps {
    errors: Errors & ErrorBag,
    p: ServerPage // p Stands for Page
    k?: TurnstileKey // Turnstile public key
    ga?: GAMeasurementID // GA Measurement ID
}

export type PrivateData = string;
export type PrivateKeyHash = string;
export type PrivateDataHash = string;
export type PrivateUser = string;
export interface PrivateDecryption extends PageConfig {
    pd: PrivateData,
    pkh: PrivateKeyHash,
    pkd: PrivateDataHash,
    pu: PrivateUser
}

export type CallbackFunction<T> = (callback: T) => void;
export interface InputCallbackArguments<T> {
    value: T,
    isValid: boolean
}
export type ServerDefaultResponse = Array<number | string | null>;
export type TurnstileKey = string;
export type GAMeasurementID = string;