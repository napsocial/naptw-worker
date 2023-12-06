import { QRCodeSVG } from "qrcode.react";
import { Card as CardComponent } from "flowbite-react";
import Card from "../Card";
import { Button, Toast } from "flowbite-react";
import { FaClipboard } from "react-icons/fa";
import { useRef, useState } from "react";
import { CallbackFunction } from "@/types";
import { analysisLog } from "@/utils";
import { Link } from "react-router-dom";

interface ElementArgument {
    url: string,
    onCreateNew: CallbackFunction<void>
}

export default function CreateSuccessful(config: ElementArgument) {
    const [showToast, setShowToast] = useState<boolean>(false);
    const QRCodeRef = useRef<HTMLDivElement>();

    const short_url = [location.host, config.url].join("/");
    const full_short_url = location.protocol.concat("//", short_url);

    function handleClick() {
        const svgElement = QRCodeRef.current.children[0] as SVGSVGElement;
        const svgData = new XMLSerializer().serializeToString(svgElement);

        const image = new Image();
        image.src = "data:image/svg+xml;base64," + btoa(svgData);

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(image, 0, 0);

            const url = canvas.toDataURL();

            const a = document.createElement('a');
            a.download = 'nap_shorter_' + config.url + '.png';
            a.href = url;

            a.click();

            analysisLog("Download", "QR Code", "ture");
        }
    }

    return <>
        {showToast && <Toast className="fixed bottom-0 left-0 min-w-full rounded-none sm:left-auto sm:min-w-[calc(100vw-3.5rem)] sm:rounded-lg sm:bottom-5 sm:right-5 border-gray-700 bg-indigo-950 z-50">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500">
                <FaClipboard className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal text-white w-full">已複製到你的剪貼簿了！</div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
        </Toast>}

        <Card title="短網址建立成功！">
            <div className="flex flex-col lg:flex-row w-full h-full">
                <div className="flex-auto mb-10 lg:mr-8 lg:mb-0">
                    <div className="flex flex-col justify-between items-center h-full">
                        <div className="w-full mb-5">
                            <p className="text-md text-gray-500 mb-3">點連結來複製！</p>
                            <a className="w-full" href={full_short_url} onClick={(event) => {
                                event.preventDefault();
                                navigator.clipboard.writeText(full_short_url);
                                analysisLog("Create Link", "Copy", "ture");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 5000);
                            }} >
                                <CardComponent>
                                    <span className="text-center text-2xl md:text-3xl text-blue-600 font-mono break-all">{short_url}</span>
                                </CardComponent>
                            </a>
                        </div>
                        <Link to={"/"} className="w-full"><Button onClick={() => config.onCreateNew()} className="w-full">建立新的短連結</Button></Link>
                    </div>
                </div>
                <div ref={QRCodeRef} className="flex flex-col border-l-0 border-t-2 justify-center border-gray-400 lg:border-l-2 lg:border-t-0 lg:pl-5">
                    <QRCodeSVG className="m-auto w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[230px] lg:h-[230px]" value={full_short_url} includeMargin={true} size={500} />
                    <Button onClick={handleClick}>下載 QR Code</Button>
                </div>
            </div>
        </Card>
    </>;
}