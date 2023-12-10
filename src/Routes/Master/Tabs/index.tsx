import { CallbackFunction } from "@/types";
import { generateRandomString } from "@/utils";
import { Tabs } from "flowbite-react";
import { IconType } from "react-icons";
import { FaLink, FaLock /*, FaSearch*/ } from "react-icons/fa";

interface ElementArgument {
    onTabChange: CallbackFunction<number>,
    status: number
}

interface TabsArgument {
    title: string,
    icon: IconType,
    disable?: boolean
}

const TABS: TabsArgument[] = [
    {
        title: "建立短連結",
        icon: FaLink
    },
    {
        title: "建立隱私連結",
        icon: FaLock
    },
    // TODO: finish this section
    //
    // {
    //     title: "短網址找查",
    //     icon: FaSearch,
    //     disable: true
    // }
];

export default function TabsElement(config: ElementArgument) {
    return <Tabs.Group
        tabIndex={config.status}
        theme={{
            base: "flex flex-col gap-2 max-w-full",
            tablist: {
                base: "flex bg-slate-200 shadow-md rounded-md p-2 flex-row w-max max-w-full",
                styles: {
                    pills: "flex-wrap font-medium text-sm text-gray-500 dark:text-gray-400 sm:space-x-2"
                },
                tabitem: {
                    base: "flex items-center justify-center p-2 sm:p-4 rounded-t-lg text-sm font-medium sm:first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:ring-4 focus:ring-cyan-300 focus:outline-none",
                    styles: {
                        pills: {
                            base: "w-full mb-2 last:mb-0 sm:w-fit sm:mb-0",
                            active: {
                                on: "rounded-lg bg-cyan-600 text-white shadow-md shadow-blue-400"
                            }
                        }
                    }
                }
            },
            tabpanel: "hidden"
        }}
        onActiveTabChange={(val) => config.onTabChange(val)}
        style="pills">
        
        {TABS.map((e, index) => <Tabs.Item key={generateRandomString(8)} icon={e.icon} title={e.title} active={index === config.status} disabled={e.disable} />)}

    </Tabs.Group>
}