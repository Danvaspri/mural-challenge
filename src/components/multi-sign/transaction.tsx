import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAdapter } from "./adapter";
import Safe from "@gnosis.pm/safe-core-sdk";

import Web3 from "web3";

export default function TransactionDetails() {
    const [transactionState, setTransactionState] = useState<any>({});

    const [safeInterface, setSafeInterface] = useState<any>();
    const hashParams = useParams();
    useEffect(() => {
        const safeAddress = localStorage.getItem("safe");

        async function initializeSafe() {
            if (!safeAddress) {
                return;
            }

            const ethAdapterOwner1 = await createAdapter();
            if (!ethAdapterOwner1) return;
            if (ethAdapterOwner1) {
                const safeSdk: Safe = await Safe.create({
                    ethAdapter: ethAdapterOwner1,
                    safeAddress,
                });
                setSafeInterface(safeSdk);
                const tx = await safeSdk.getOwners();
            }
        }
        initializeSafe();
    }, []);

    let params = useParams();

    return (
        <>
            {console.log(params)}
            <div></div>
        </>
    );
}
