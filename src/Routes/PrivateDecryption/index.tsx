import { useState, useEffect } from "react";
import Input from "@/Components/Input";
import { PrivateDecryption } from "@/types";
import { Alert } from "flowbite-react";
import { FaKey } from "react-icons/fa";
import { HashAlgorithm, convertBinaryToString, convertStringToBinary, createBinaryHashHex, createHashHex, decryption } from "@/crypto";
import useTitle from "@/Hooks/useTitle";

enum DecryptionStatus {
    Default,
    Error
}

export default function PrivateDecryption() {
    useTitle("Private Decryption");
    
    const data = {
        pkh: "test",
        pd: "rest",
        pkd: "test"
    };
    const [status, setStatus] = useState<DecryptionStatus>(DecryptionStatus.Default);
    const [error, setError] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        createHashHex(password, HashAlgorithm.SHA1).then(e => setIsValid(e === data.pkh));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password]);

    async function handleSubmit() {
        const org_data = data.pd;
        const dec = await decryption(org_data, convertStringToBinary(password));

        if (await createBinaryHashHex(dec, HashAlgorithm.SHA1) !== data.pkd) {
            setStatus(DecryptionStatus.Error);
            setError("We cannot decrypt the data, the hash of decrypted is not match the original.");
            return;
        }

        location.href = convertBinaryToString(dec);
    }

    return <>
        <Alert color="cyan" rounded className="mb-10 w-4/5 m-auto absolute top-0">
            <span>
                <p>
                    <span className="font-bold block">Notice</span>
                    In the decryption section, The NAP Network <span className="font-bold">WON'T</span> collect your data.
                </p>
            </span>
        </Alert>

        <div className="w-full">
            <div className="mb-5">
                <h1 className="text-5xl sm:text-7xl font-bold mb-3">Let's Decryption!</h1>
                <p className="text-md sm:text-lg text-gray-800">It seems you received an encrypted short URL. You have to decrypt the data to access the original URL!</p>
            </div>

            {
                (() => {
                    switch (status) {
                        case DecryptionStatus.Default:
                            return <Input
                                onSubmit={handleSubmit}
                                onChange={(val) => setPassword(val.value)}
                                placeholder="Your_Very_Strong_Password"
                                actionType={(password.length > 0 && !isValid) ? "failure" : null}
                                isSubmitDisable={!isValid}
                                icon={FaKey}
                                type="password"
                                additionalText={(password.length > 0 && !isValid) && "Your password isn't correct!"}
                                sendMessage="Decrypt!" />;
                        case DecryptionStatus.Error:
                            return <Alert color="red" rounded>
                                <span>
                                    <p>
                                        <span className="font-bold block">Error</span>
                                        {error}
                                    </p>
                                </span>
                            </Alert>;
                    }
                })()
            }
        </div>
    </>;
}