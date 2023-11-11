import { Spinner } from "flowbite-react";
import Card from "../Card";

export default function Creating() {
    return <Card title="建立中...">
        <Spinner size="xl" className="m-auto w-full" />
    </Card>
}