import { useState } from "react";
import { Spinner } from "flowbite-react";
import { FaLink, FaKey, FaCalendar } from "react-icons/fa";
import Input from "@/Components/Input";
import { CallbackFunction, InputCallbackArguments } from "@/types";
import { ServerStatus, Status } from "../utils";
import { HashAlgorithm, convertStringToBinary, createHashHex, encryption } from "@/crypto";
import axios from "axios";
import { ServerResponse } from "http";
import { ServerShortError } from "@/utils";

interface ElementArgument {
    onStatusChange: CallbackFunction<Status>,
    onErrorChange: CallbackFunction<ServerShortError>,
    onURLChange: CallbackFunction<string>,
    status: Status,
    turnstileToken?: string
}

export default function CreatePrivate(config: ElementArgument) {
    const [isValid, setIsValid] = useState<boolean>(false);
    const [url, setURL] = useState<string>("");
    const [date, setDate] = useState<number>(null);
    const [password, setPassword] = useState<string>("");
    
    const min_time = Date.now();
    const max_time = min_time + 2592000000; // The int is for 30 days (1 month)

    function handleURLInputChange(arg: InputCallbackArguments<string>) {
        setIsValid(arg.isValid);
        setURL(encodeURI(arg.value));
    }

    async function handleSubmit() {
        if (!url.length || !date || !password.length) return;

        config.onStatusChange(Status.Creating);

        const [key_hash, original_hash, original_encrypted] = await Promise.all([
            createHashHex(password, HashAlgorithm.SHA1),
            createHashHex(url, HashAlgorithm.SHA1),
            encryption(convertStringToBinary(url), convertStringToBinary(password))
        ]);

        const request = await axios.post<ServerResponse>('/api/private', {
            ul: original_encrypted,
            ep: date,
            ho: original_hash,
            hk: key_hash,
            vf: config.turnstileToken,
        });

        switch (request.data[0]) {
            case ServerStatus.Error:
                config.onErrorChange(Number(request.data[1]));
                config.onStatusChange(Status.Error);
                break;

            case ServerStatus.CreateSuccess:
                config.onURLChange("s:" + request.data[1].toString());
                config.onStatusChange(Status.CreateSuccessful);
        }
    }

    return <>
        <div>
            <h1 className="text-5xl mb-5 font-black sm:text-7xl">Secure Your Link Shortening!</h1>
            <div className="mb-3">
                <Input
                    onChange={handleURLInputChange}
                    actionType={(!isValid && url.length > 0) ? "failure" : null}
                    placeholder="https://your.very/private?url=here"
                    type="url"
                    inputPattern="https?://.+"
                    icon={FaLink}
                    additionalText={(!isValid && url.length > 0) && "The url isn't valid!"}
                />
            </div>
            <div className="mb-3">
                <Input
                    onChange={(v) => setPassword(v.value)}
                    placeholder="Your_Very_Secure_Password"
                    type="password"
                    icon={FaKey} />
            </div>
            <div className="mb-5">
                <Input
                    onSubmit={handleSubmit}
                    onChange={(v) => setDate(new Date(v.value).getTime())}
                    isSubmitDisable={!isValid || (!url.length || !date || !password.length) || !config.turnstileToken}
                    placeholder="Date to Expire"
                    additionalText="An expired time is necessary. Up to 30 days."
                    type="datetime-local"
                    icon={FaCalendar}
                    inputArgument={{
                        min: new Date(min_time).toISOString().slice(0, -8),
                        max: new Date(max_time).toISOString().slice(0, -8)
                    }}
                    sendMessage={config.turnstileToken ? "Create!" : <Spinner size="lg" className="m-auto w-full" />} />
            </div>
        </div>

        <p className="text-sm text-gray-500 mb-2">To create a private short url, you have to agree to The NAP Network's <a className="text-sky-500" href="/terms">Terms of Service</a> and <a className="text-sky-500" href="/privacy">Privacy Policy</a>.</p>
        <p className="text-sm text-gray-500 mb-5">Also, the encryption process of creating a private short url is in your local device.</p>
    </>;
}