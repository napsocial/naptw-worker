import { useEffect, useState } from "react";

export default function useFetch<T>(url: string): T {
    const [data, setData] = useState<T>(null);
    const [abort] = useState(new AbortController());

    useEffect(() => {
        fetch(url, { signal: abort.signal })
            .then(e => e.json<T>())
            .then(e => setData(e));
    }, [url]);

    return data;
}