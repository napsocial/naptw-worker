import { ServerShortError } from "@/utils";
import Card from "../Card"
import ReactGA from "react-ga4";
import { useEffect } from "react";

interface ElementArgument {
    errorMessage: ServerShortError
}

const enum ErrorMessage {
    URLNotValid        = "您所輸入的並非為有效的網址",
    CustomLinkNotValid = "您自訂的短連結為非法網址",
    Duplicate          = "您自訂的短連結重複了",
    NeedLogin          = "您必須登入來執行此操作",
    TurnsileNotPass    = "您不得使用機器人來建立短連結，請使用NAP Shorter API建立"
}

export default function Error(config: ElementArgument) {
    useEffect(() => {
        ReactGA.event('create_failed', {
            failed: config.errorMessage
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Card title="建立失敗！">
        <p>在生成短連結時發生錯誤，詳情如下：</p>
        <p>{((): string => {
            switch (config.errorMessage) {
                case ServerShortError.URLNotValid:
                    return ErrorMessage.URLNotValid;
                case ServerShortError.CustomLinkNotValid:
                    return ErrorMessage.CustomLinkNotValid;
                case ServerShortError.Duplicate:
                    return ErrorMessage.Duplicate;
                case ServerShortError.NeedLogin:
                    return ErrorMessage.NeedLogin;
                case ServerShortError.TurnsileNotPass:
                    return ErrorMessage.TurnsileNotPass
                
                default:
                    return "未知原因的錯誤！請聯繫我們的開發人員以協助您解決此問題！"
            }
        })()}</p>
    </Card>;
}