import { Card } from "flowbite-react";

interface ElementArgument {
    title: string,
    children: JSX.Element | JSX.Element[]
}

export default function CardElement(config: ElementArgument) {
    return <Card>
        <h1 className="text-4xl sm:text-5xl font-bold mb-5">{config.title}</h1>
        {config.children}
    </Card>;
}