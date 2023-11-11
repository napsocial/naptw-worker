import Input from "@/Components/Input";
import { CallbackFunction, InputCallbackArguments } from "@/types";
import { Button, ToggleSwitch, Card, Spinner } from "flowbite-react";
import { FaLink, FaCalendar } from "react-icons/fa";
import { useState } from "react";
import type { AdvanceOption, AdvanceOptionNames } from "@/types/master";
import { ServerStatus, Status } from "../utils";
import { ServerShortError } from "@/utils";
import axios from "axios";
import ReactGA from 'react-ga4';
import { ServerResponse } from "http";

interface CreateArgument {
    onStatusChange: CallbackFunction<Status>,
    onURLChange: CallbackFunction<string>,
    onErrorChange: CallbackFunction<ServerShortError>,
    status: Status,
    urlForShort: string,
    turnstileToken?: string
}

export default function URLCreate(config: CreateArgument) {
    const [showOption, setShowOption] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [url, setURL] = useState<string>("");
    const [optitionConfig, setOptitionConfig] = useState<AdvanceOption>({
        isEP: false,
    });

    const VALID_TEXT = <>當你使用NAP短網址服務時，即代表您同意我們的<a className="text-sky-500" href="/terms">服務條款</a>與<a className="text-sky-500" href="/privacy">隱私權政策</a>。</>;
    const NOT_VALID_TEXT = <>請注意！您輸入的不是有效的網址。</>;

    async function handleSubmit() {
        if (url.length === 0 || !config.turnstileToken) return;
        if (optitionConfig && optitionConfig.isEP && !optitionConfig.ep) return;
        config.onStatusChange(Status.Creating);
        const request = await axios.post<ServerResponse>('/api/web', {
            ul: encodeURI(url),
            vf: config.turnstileToken,
            ...optitionConfig
        });

        ReactGA.event('create_link');
        if (optitionConfig && optitionConfig.isEP) ReactGA.event('create_expire');

        switch (request.data[0]) {
            case ServerStatus.Error:
                config.onErrorChange(Number(request.data[1]));
                config.onStatusChange(Status.Error);
                break;

            case ServerStatus.CreateSuccess:
                config.onURLChange(request.data[1].toString());
                config.onStatusChange(Status.CreateSuccessful);
        }
    }

    function handleShowOptition() {
        setShowOption(!showOption);
    }

    function handleOptitionChange(name: AdvanceOptionNames, value?: string) {
        const orgConfig = Object.assign({}, optitionConfig);
        switch (name) {
            case "iep":
                orgConfig.isEP = !orgConfig.isEP;
                orgConfig.ep = undefined;
                break;
            case "ep":
                orgConfig.ep = new Date(value).getTime();
        }

        setOptitionConfig(orgConfig);
    }

    function handleInputChange(val: InputCallbackArguments<string>) {
        const u = val.value.trim();

        setURL(u);
        setIsValid(val.isValid);
    }

    return <>
        <div>
            <h1 className="text-5xl mb-5 font-black sm:text-7xl">立即縮短您的網址！</h1>
            <Input
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitDisable={!isValid || url.length === 0 || !config.turnstileToken}
                actionType={!isValid ? "failure" : null}
                placeholder="https://this.is/a/very?long=url"
                type="url"
                inputPattern="https?://.+"
                icon={FaLink}
                sendMessage={config.turnstileToken ? "Create!" : <Spinner size="lg" className="m-auto w-full" />}
                additionalText={isValid ? VALID_TEXT : NOT_VALID_TEXT} />
        </div>
        
        <Button className={"mt-5 " + (showOption ? "rounded-bl-none rounded-br-none" : "")} onClick={handleShowOptition}>進階選項</Button>
        {
            showOption && <Card className="rounded-tl-none">
                <h1 className="text-2xl">進階選項</h1>
                <div className="flex flex-col sm:flex-row">
                    <div className="my-3 flex-auto w-full sm:max-w-xs">
                        <ToggleSwitch className="mb-3" checked={optitionConfig.isEP} label={"開啟自動清除"} onChange={() => handleOptitionChange('iep')} />
                        {
                            optitionConfig.isEP && <Input
                                icon={FaCalendar}
                                defaultValue={optitionConfig.ep ? new Date(optitionConfig.ep).toISOString().slice(0, -8) : ""}
                                className="mt-2"
                                type="datetime-local"
                                onChange={(v) => handleOptitionChange('ep', v.value)}
                                inputArgument={{
                                    min: new Date().toISOString().slice(0, -8)
                                }} />
                        }
                    </div>
                </div>
            </Card>
        }
    </>
}