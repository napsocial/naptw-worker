import { lazy, useState } from "react";
import Creating from "./Creating";
import { ServerShortError, analysisLog } from "@/utils";
import URLCreate from "./URLCreate";
import { Status } from "./utils";
import { Turnstile } from "@marsidev/react-turnstile";
import Tabs from "./Tabs";
import CreatePrivate from "./CreatePrivate";
import Introduction from "./Introduction";
import { FaAngleDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const ErrorPage = lazy(() => import('./Error'));
const CreateSuccessful = lazy(() => import('./CreateSuccessful'));
const CreateByBookmark = lazy(() => import('./CreateByBookmark'));

export default function Master(config: { isBookmarkCreate?: boolean }) {
    const { hash } = useLocation();

    const [type, setType] = useState<number>(0);
    const [status, setStatus] = useState<Status>((config.isBookmarkCreate && Status.CreateByBookmark) || Status.Default);
    const [errorType, setErrorType] = useState<ServerShortError>(null);
    const [token, setToken] = useState<string>(null);
    const [url, setURL] = useState<string>((config.isBookmarkCreate && hash.replace("#", "")) || '');

    function handleCreateNew() {
        analysisLog("Create Link", "Regenerate", "true");
        setStatus(Status.Default);
        setURL('');
        setErrorType(null);
        setToken(null);
        setType(0);
    }

    function handleType(type: number) {
        setType(type);
        setStatus(type === 0 ? Status.Default : Status.CreatePrivate);
    }

    const STATUS = {
        // Default Page
        [Status.Default]:
            <URLCreate
                onStatusChange={setStatus}
                onErrorChange={setErrorType}
                onURLChange={setURL}
                turnstileToken={token}
                status={status}
                urlForShort={url} />,
        
        // Private short link create page
        [Status.CreatePrivate]:
            <CreatePrivate
                onStatusChange={setStatus}
                onErrorChange={setErrorType}
                onURLChange={setURL}
                turnstileToken={token}
                status={status} />,
        
        // Loading page
        [Status.Creating]: <Creating />,

        // Short link create successful page
        [Status.CreateSuccessful]:
            <CreateSuccessful
                url={url}
                onCreateNew={handleCreateNew} />,
        
        // Create short link from bookmark
        [Status.CreateByBookmark]:
            <CreateByBookmark
                onStatusChange={setStatus}
                onErrorChange={setErrorType}
                onURLChange={setURL}
                url={url}
                turnstileToken={token} />,
        
        // Create Failed or other errors
        [Status.Error]:
            <ErrorPage
                errorMessage={errorType} />
    }

    return <>
        <div className="min-h-[calc(100vh-7rem)] w-full flex flex-col">
            {[Status.Default, Status.CreatePrivate, Status.URLLookUp, Status.CreateByBookmark].includes(status) && <>
                <Turnstile
                    className="absolute bottom-3"
                    siteKey={import.meta.env.DEV ? "1x00000000000000000000BB" : "0x4AAAAAAAIU6xRp_Pkz9eMW"}
                    onSuccess={setToken} />
                {status !== Status.CreateByBookmark && <div className="w-full h-fit flex justify-center top-2 mb-5 px-5">
                    <Tabs onTabChange={handleType} status={type} />
                </div>}
            </>}

            <div className="flex-auto flex flex-col sm:items-center justify-center m-auto w-11/12 min-h-full md:w-4/5 max-w-7xl">
                <div className="w-full">
                    {STATUS[status]}
                </div>

                <span className="hidden md:block mt-5">將「<a className="text-blue-500" onClick={(event) => {
                    event.preventDefault()
                    alert("將此聯結拖移至您的書籤列，即可快速生成！")
                }} href={`javascript:(function(){window.open("${location.protocol}//${location.host}/c/u".concat("#",encodeURIComponent(location.href)))})();`}>生成短連結 ({location.host})</a>」加入至您的書籤列，即可快速生成短連結！</span>
            </div>
            <div className="text-center from-white to-theme bg-gradient-to-b w-full">
                <div className="flex flex-col w-fit m-auto px-2 pt-14">
                    <span className="text-lg bg-blue-700 text-white mb-5 px-2 w-fit mx-auto rounded-lg">往下看更多</span>
                    <FaAngleDown className="m-auto text-white animate-bounce mb-1" size={56} />
                </div>
            </div>
        </div>

        <Introduction />
    </>;
}