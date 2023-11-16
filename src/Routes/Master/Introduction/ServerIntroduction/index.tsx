import ServerImage from "@/Components/Images/ServerImage.svg?react";
import Container from "../Container";

export default function ServerIntroduction() {
    return <Container image={ServerImage} title="邊緣直連！">
        <p>始於雲端，用於雲端。我們使用<a className="text-blue-500" href="https://workers.cloudflare.com/">Cloudflare Workers</a>作為我們的後端，一切都於與你最近的CDN站點執行。速度甚至可達毫秒級*。</p>
        <p className="mt-3">*經實測，小睡一下短網址服務的載入速度可在100毫秒以內！(這可能因地區而異)</p>
    </Container>
}