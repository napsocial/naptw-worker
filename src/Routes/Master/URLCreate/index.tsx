import Input from "@/Components/Input";
import { CallbackFunction, InputCallbackArguments } from "@/types";
import { Button, ToggleSwitch, Card, Spinner } from "flowbite-react";
import { FaLink, FaCalendar } from "react-icons/fa";
import { useState } from "react";
import type { AdvanceOption, AdvanceOptionNames } from "@/types/master";
import { ServerStatus, Status, createShort } from "../utils";
import { ServerShortError } from "@/utils";

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
    const WAIT_FOR_TURNSTILE = <>目前正在等待人類驗證成功...</>;

    async function handleSubmit() {
        config.onStatusChange(Status.Creating);

        const res = await createShort({
            url: url,
            turnstile: config.turnstileToken,
            configArgs: optitionConfig
        });

        if (!res) return config.onStatusChange(Status.Default);

        switch (res.status) {
            case ServerStatus.Error:
                config.onErrorChange(res.error);
                config.onStatusChange(Status.Error);
                break;

            case ServerStatus.CreateSuccess:
                config.onURLChange(res.short);
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
                additionalText={isValid ? (config.turnstileToken ? VALID_TEXT : WAIT_FOR_TURNSTILE) : NOT_VALID_TEXT} />
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