import { ServerShortError, analysisLog } from "@/utils";
import Card from "../Card"
import { useEffect } from "react";

interface ElementArgument {
    errorMessage: ServerShortError
}

const ErrorMessage = {
    [ServerShortError.URLNotValid]:          "您所輸入的並非為有效的網址",
    [ServerShortError.CustomLinkNotValid]:   "您自訂的短連結為非法網址",
    [ServerShortError.Duplicate]:            "您自訂的短連結重複了",
    [ServerShortError.NeedLogin]:            "您必須登入來執行此操作",
    [ServerShortError.TurnsileNotPass]:      "您不得使用機器人來建立短連結，請使用NAP Shorter API建立"
}

export default function Error(config: ElementArgument) {
    useEffect(() => {
        analysisLog("Create Link", "Failed", ErrorMessage[config.errorMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Card title="建立失敗！">
        <p>在生成短連結時發生錯誤，詳情如下：</p>
        <p>{ErrorMessage[config.errorMessage] ?? "未知原因的錯誤！請聯繫我們的開發人員以協助您解決此問題！"}</p>
    </Card>;
}