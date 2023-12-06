import axios from "axios";
import { AdvanceOption } from "@/types/master";
import { analysisLog } from "@/utils";
import { ServerResponse } from "http";

export const enum ServerStatus {
    CreateSuccess = 1 << 1,
    Error         = -1,
}

export const enum Status {
    Default,
    CreatePrivate,
    CreateByBookmark,
    URLLookUp,
    Creating,
    CreateSuccessful,
    Error
}

interface CreateShortArguments {
    url: string,
    turnstile: string,
    configArgs?: AdvanceOption
}

interface CreateShortReturn {
    short?: string,
    error?: number,
    status: ServerStatus
}

export const createShort = async (args: CreateShortArguments): Promise<CreateShortReturn | undefined> => {
    if (args.url.length === 0 || !args.turnstile) return;
    if (args.configArgs && args.configArgs.isEP && !args.configArgs.ep) return;
    const request = await axios.post<ServerResponse>('/api/web', {
        ul: encodeURI(args.url),
        vf: args.turnstile,
        ...args.configArgs
    });

    analysisLog("Create Link", "Create", "Short");
    if (args.configArgs && args.configArgs.isEP) analysisLog("Create Link", "Create", "Expire");

    return {
        status: request.data[0],
        short: request.data[1].toString(),
        error: Number(request.data[1])
    };
}