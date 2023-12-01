import { SVGProps } from "react";

export interface ContainerArgument{
    title: string,
    children: string | JSX.Element | JSX.Element[],
    image: React.FunctionComponent<SVGProps<SVGSVGElement> & { title?: string; }>
}

export default function Container(arg: ContainerArgument) {
    return <div className="max-w-4/5 md:max-w-xl lg:max-w-xs p-5 rounded-xl bg-white shadow-md my-1 mx-2 lg:my-2">
        <arg.image className="mb-3" width={150} />
        <span className="text-3xl font-bold">{arg.title}</span>
        <div className="mt-5">{arg.children}</div>
    </div>
}