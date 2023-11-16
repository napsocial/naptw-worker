import { generateRandomString } from "@/utils";
import { Label, TextInput, Button, TextInputProps } from "flowbite-react";
import { HTMLInputTypeAttribute, useState } from "react";
import { IconType } from "react-icons";
import { CallbackFunction, InputCallbackArguments } from "@/types";

interface InputElement {
    onChange?: CallbackFunction<InputCallbackArguments<string>>,
    onSubmit?: CallbackFunction<void>,
    label?: string,
    type?: HTMLInputTypeAttribute,
    placeholder?: string,
    sendMessage?: string | JSX.Element,
    icon?: IconType,
    className?: string,
    additionalText?: string | JSX.Element,
    actionType?: 'gray' | 'info' | 'failure' | 'warning' | 'success' | null,
    isSubmitDisable?: boolean,
    inputPattern?: string,
    inputArgument?: TextInputProps,
    defaultValue?: string
}

export default function Input(config: InputElement) {
    const [ID] = useState(generateRandomString(8));

    return <div className="w-full">
        {config.label && <div className="mb-2 block">
            <Label
                htmlFor={ID}
                color={config.actionType ?? ""}
                value={config.label} />
        </div>}
        <div className="flex flex-col sm:flex-row w-full">
            <TextInput
                className="w-full"
                icon={config.icon}
                color={config.actionType ?? ""}
                sizing="lg"
                id={ID}
                onChange={(event) => config.onChange({
                    value: event.target.value,
                    isValid: event.target.validity.valid
                })}
                defaultValue={config.defaultValue}
                pattern={config.inputPattern ?? ""}
                type={config.type ?? "text"}
                placeholder={config.placeholder}
                {...config.inputArgument} />
            {config.sendMessage && <Button type="submit" onClick={() => config.onSubmit()} disabled={config.isSubmitDisable} className="min-w-[9rem] w-full p-2 sm:w-max sm:ml-2 sm:p-0 mt-2 sm:mt-0 h-auto">{config.sendMessage}</Button>}
        </div>
        {config.additionalText && <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500">{config.additionalText}</p>}
    </div>;
}