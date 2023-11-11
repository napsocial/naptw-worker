import { lazy, useState } from "react";
import Creating from "./Creating";
import { ServerShortError } from "@/utils";
import ReactGA from 'react-ga4';
import URLCreate from "./URLCreate";
import { Status } from "./utils";
import { Turnstile } from "@marsidev/react-turnstile";
import Tabs from "./Tabs";
import CreatePrivate from "./CreatePrivate";

const ErrorPage = lazy(() => import('./Error'));
const CreateSuccessful = lazy(() => import('./CreateSuccessful'));

export default function Master() {
    const [type, setType] = useState<number>(0);
    const [status, setStatus] = useState<Status>(Status.Default);
    const [errorType, setErrorType] = useState<ServerShortError>(null);
    const [token, setToken] = useState<string>(null);
    const [url, setURL] = useState<string>('');

    function handleCreateNew() {
        ReactGA.event('regenerate_url');
        setStatus(Status.Default);
        setURL('');
        setErrorType(null);
        setToken(null);
        setType(0);
    }

    function handleType(type: number) {
        setType(type);
        switch (type) {
            case 0:
                return setStatus(Status.Default);
            case 1:
                return setStatus(Status.CreatePrivate);
        }
    }

    return <>
        {[Status.Default, Status.CreatePrivate, Status.URLLookUp].includes(status) && <>
            <Turnstile
                className="absolute bottom-3"
                siteKey={process.env.NODE_ENV.match("development") ? "1x00000000000000000000BB" : "0x4AAAAAAAIU6xRp_Pkz9eMW"}
                onSuccess={setToken} />
            <div className="w-full h-fit flex justify-center top-2 mb-5">
                <Tabs onTabChange={handleType} status={type} />
            </div>
        </>}

        <div className="flex-auto flex sm:items-center justify-center m-auto w-full md:w-11/12 min-h-full">

            <div className="w-full">
                {
                    ((): JSX.Element => {
                        switch (status) {
                            case Status.Default:
                                return <URLCreate
                                    onStatusChange={setStatus}
                                    onErrorChange={setErrorType}
                                    onURLChange={setURL}
                                    turnstileToken={token}
                                    status={status}
                                    urlForShort={url} />;
                            case Status.CreatePrivate:
                                return <CreatePrivate
                                    onStatusChange={setStatus}
                                    onErrorChange={setErrorType}
                                    onURLChange={setURL}
                                    turnstileToken={token}
                                    status={status} />;
                            case Status.Creating:
                                return <Creating />;
                            case Status.CreateSuccessful:
                                return <CreateSuccessful url={url} onCreateNew={handleCreateNew} />;
                            case Status.Error:
                                return <ErrorPage errorMessage={errorType} />;
                        }
                    })()
                }
            </div>

        </div>
    </>;
}