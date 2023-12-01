import { useState, useEffect } from "react";
import ServerImage from "@/Components/Images/ServerImage.svg?react";
import Container from "../Container";

const pg = async () => {
    const pingStart = performance.now();
    await fetch("/api/ping");
    return performance.now() - pingStart;
}

export default function ServerIntroduction() {
    const [ping, setPing] = useState<number>(0);

    async function sp() {
        setPing(await pg());
    }

    useEffect(() => {
        (async () => setPing(await pg()))();
    }, []);

    return <Container image={ServerImage} title="邊緣直連！">
        <p>始於雲端，用於雲端。我們使用<a className="text-blue-500" href="https://workers.cloudflare.com/">Cloudflare Workers</a>作為我們的後端，一切都於與你最近的CDN站點執行。速度甚至可達毫秒級。</p>
        <p className="mt-3">您的連線速度: <span className="font-mono">{ping.toFixed(2)}ms</span> <span onClick={sp} className="text-blue-500 select-none cursor-pointer">再次測試</span></p>
    </Container>
}