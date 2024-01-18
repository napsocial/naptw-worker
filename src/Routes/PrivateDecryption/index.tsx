import { useState, useEffect } from "react";
import Input from "@/Components/Input";
import { PrivateDecryption } from "@/types";
import { Alert, Spinner } from "flowbite-react";
import { FaKey } from "react-icons/fa";
import { HashAlgorithm, convertBinaryToString, convertStringToBinary, createBinaryHashHex, createHashHex, decryption } from "@/crypto";
import useTitle from "@/Hooks/useTitle";
import useFetch from "@/Hooks/useFetch";
import { useParams } from "react-router-dom";
import { ServerStatus } from "../Master/utils";

enum DecryptionStatus {
    Default,
    Error
}

function AlertBox({ children }: { children: string }) {
    return <Alert color="red" rounded>
        <span>
            <p>
                <span className="font-bold block">Error</span>
                {children}
            </p>
        </span>
    </Alert>
}

export default function PrivateDecryption() {
    useTitle("Private Decryption");
    
    const { short } = useParams();
    const data = useFetch<Array<string | number>>("/api/private/".concat(short));
    const [status, setStatus] = useState<DecryptionStatus>(DecryptionStatus.Default);
    const [error, setError] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(false);

    useEffect(() => {
        if (!data) return;
        createHashHex(password, HashAlgorithm.SHA1).then(e => setIsValid(e === data[5]));
    }, [password, data]);

    async function handleSubmit() {
        const org_data = data[3] as string;
        const dec = await decryption(org_data, convertStringToBinary(password));

        if (await createBinaryHashHex(dec, HashAlgorithm.SHA1) !== data[4]) {
            setStatus(DecryptionStatus.Error);
            setError("We cannot decrypt the data, the hash of decrypted data doesn't match the original.");
            return;
        }

        location.href = convertBinaryToString(dec);
    }

    const STATUS = {
        [DecryptionStatus.Default]:
            <Input
                onSubmit={handleSubmit}
                onChange={(val) => setPassword(val.value)}
                placeholder="Your_Very_Strong_Password"
                actionType={(password.length > 0 && !isValid) ? "failure" : null}
                isSubmitDisable={!isValid}
                icon={FaKey}
                type="password"
                additionalText={(password.length > 0 && !isValid) && "Your password isn't correct!"}
                sendMessage="Decrypt!" />,
        [DecryptionStatus.Error]: <AlertBox>{error}</AlertBox>
    };

    return <>
        <Alert color="cyan" rounded className="mb-10 w-4/5 m-auto absolute top-0">
            <span>
                <p>
                    <span className="font-bold block">Notice</span>
                    In the decryption section, The NAP Platform <span className="font-bold">WON'T</span> collect your data.
                </p>
            </span>
        </Alert>

        <div className="w-4/5">
            <div className="mb-5">
                <h1 className="text-5xl sm:text-7xl font-bold mb-3">Let's Decrypt!</h1>
                <p className="text-md sm:text-lg text-gray-800">It seems you received an encrypted short URL. You have to decrypt the data to access the original URL!</p>
            </div>

            {!data && <Spinner size="xl" className="m-auto w-full" />}
            {data && data[0] === ServerStatus.Error && <AlertBox>We cannot get the encrypted short link from our database. Is your short link expired?</AlertBox>}
            {data && data[0] !== ServerStatus.Error && STATUS[status]}
        </div>
    </>;
}