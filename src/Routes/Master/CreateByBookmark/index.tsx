import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import Card from "../Card";
import { ServerStatus, Status, createShort } from "../utils";
import { CallbackFunction } from "@/types";
import { ServerShortError } from "@/utils";

interface Arguments {
    onStatusChange: CallbackFunction<Status>,
    onURLChange: CallbackFunction<string>,
    onErrorChange: CallbackFunction<ServerShortError>,
    turnstileToken?: string,
    url: string,
}

export default function CreateByBookmark(args: Arguments) {
    useEffect(() => {
        if (!args.turnstileToken || !args.url) return;

        async function cr() {
            const res = await createShort({
                url: decodeURIComponent(args.url),
                turnstile: args.turnstileToken
            });

            switch (res.status) {
                case ServerStatus.Error:
                    args.onErrorChange(res.error);
                    args.onStatusChange(Status.Error);
                    break;

                case ServerStatus.CreateSuccess:
                    args.onURLChange(res.short);
                    args.onStatusChange(Status.CreateSuccessful);
            }
        }

        cr();
    }, [args, args.turnstileToken, args.url]);

    return <Card title="正在建立網址中...">
        <div className="flex items-center">
            <Spinner size="xl" className="w-full m-5" />
            <div className="ml-10">
                <p className="text-4xl font-bold">正在縮短 <span className="font-mono text-blue-500 block">{decodeURIComponent(args.url)}</span></p>
                {!args.turnstileToken && <p className="text-gray-700 mt-5">目前正在等待人類驗證成功...</p>}
            </div>
        </div>
    </Card>;
}