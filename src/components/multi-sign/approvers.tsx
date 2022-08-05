import { useEffect, useState } from "react";
import { createAdapter } from "./adapter";
import Safe from "@gnosis.pm/safe-core-sdk";

export default function Approvers({ safeAddress }: { safeAddress: string }) {
    const [approvers, setApprovers] = useState<any>({});
    const [safeInterface, setSafeInterface] = useState<any>({});
    const [threshold, setThreshold] = useState("");
    const [swap, setSwap] = useState<any>({});

    useEffect(() => {
        async function initializeSafe() {
            if (!safeAddress) {
                return;
            }
            const ethAdapterOwner1 = await createAdapter();
            if (ethAdapterOwner1) {
                const safeSdk: Safe = await Safe.create({
                    ethAdapter: ethAdapterOwner1,
                    safeAddress,
                });
                setSafeInterface(safeSdk);
                const owners = await safeSdk.getOwners();
                const thresholdCurrent = await safeSdk.getThreshold();

                if (owners.length > 0) {
                    const nicknameOwners: any = {};
                    let localOwners: any = localStorage.getItem("ownersBook");
                    if (localOwners) {
                        localOwners = JSON.parse(localOwners);

                        owners.forEach((each: any) => {
                            if (localOwners[each.toLowerCase()]) {
                                nicknameOwners[each] =
                                    localOwners[each.toLowerCase()];
                                return;
                            }

                            nicknameOwners[each] = "";
                        });
                    }

                    setApprovers(() => {
                        return { ...nicknameOwners };
                    });
                    setThreshold((prev) => {
                        return thresholdCurrent + "";
                    });
                }
            }
        }
        initializeSafe();
    }, [safeAddress]);

    async function triggerRemoveOwner(owner: string) {
        if (safeInterface) {
            const removetx = await safeInterface.getRemoveOwnerTx({
                ownerAddress: owner,
            });
            safeInterface.signTransaction(removetx, "eth_sign").then(() => {
                safeInterface
                    .executeTransaction(removetx)
                    .then(() => console.log("Successfully removed owner"));
            });
        }
    }
    async function triggerChangeOwner(owner1: string, event: any) {
        setSwap(() => {
            let newState = {};
            return { ...newState };
        });
        event.preventDefault();
        console.log(event, owner1);
        const owner2 = event.target[0].value;
        if (safeInterface) {
            const tx = await safeInterface.getSwapOwnerTx({
                oldOwnerAddress: owner1,
                newOwnerAddress: owner2,
            });
            safeInterface.signTransaction(tx, "eth_sign").then(() => {
                safeInterface
                    .executeTransaction(tx)
                    .then(() =>
                        console.log(
                            `Successfully changed owner from ${owner1} to ${owner2}`
                        )
                    );
            });
        }
    }

    async function changeThreshold(event: any) {
        event.preventDefault();
        if (safeInterface) {
            const tx = await safeInterface.getChangeThresholdTx(
                parseInt(threshold)
            );

            if (tx) {
                safeInterface.signTransaction(tx, "eth_sign").then(() => {
                    safeInterface
                        .executeTransaction(tx)
                        .then(() =>
                            console.log("Successfully changed threshold")
                        );
                });
            }
        }
    }
    function changeNickName(newNickName: string, address: string) {
        setApprovers((approvers: any) => {
            const newNick: any = {};
            newNick[address] = newNickName;

            const newState = { ...approvers, ...newNick };
            const newLocalState: any = {};
            Object.keys(newState).forEach((each: any) => {
                newLocalState[each.toLowerCase()] = newState[each];
            });
            localStorage.setItem("ownersBook", JSON.stringify(newLocalState));

            return { ...newState };
        });
    }

    function changeAddress(event: any, address: string) {
        setApprovers((approvers: any) => {
            if (event === "") {
                return { ...approvers };
            }
            let nickname: any = approvers[address];
            let newApprover: any = {};
            newApprover[event] = nickname;
            delete approvers[address];

            return { ...approvers, ...newApprover };
        });
    }
    function initializeSwap(index: number, initialAddress: string) {
        setSwap(() => {
            let newState = { index, initialAddress };
            return { ...newState };
        });
    }

    function cancelSwap() {
        setSwap(() => {
            let newState = { index: -1, initialAddress: "" };
            return { ...newState };
        });
    }

    return (
        <>
            {safeAddress && (
                <div>
                    Safe Address: {safeAddress}
                    <table>
                        <thead>
                            <tr>
                                <th>Nickname</th>
                                <th>Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            {approvers &&
                                Object.keys(approvers).map((each, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <input
                                                id={`nickName${idx}${each}`}
                                                value={approvers[each]}
                                                onChange={(event) => {
                                                    changeNickName(
                                                        event.target.value,
                                                        each
                                                    );
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {swap.index !== idx && each}
                                            {swap.index === idx && (
                                                <form
                                                    onSubmit={(event: any) =>
                                                        triggerChangeOwner(
                                                            swap.initialAddress,
                                                            event
                                                        )
                                                    }
                                                >
                                                    <input
                                                        id={`address${idx}${each}`}
                                                        value={each.toLowerCase()}
                                                        onChange={(event) => {
                                                            changeAddress(
                                                                event.target
                                                                    .value,
                                                                each
                                                            );
                                                        }}
                                                    />
                                                    <button type="submit">
                                                        Apply
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            cancelSwap()
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </form>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    initializeSwap(idx, each)
                                                }
                                            >
                                                Swap approver
                                            </button>
                                        </td>

                                        <td>
                                            <button
                                                onClick={() =>
                                                    triggerRemoveOwner(each)
                                                }
                                            >
                                                Remove approver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div>
                        <button>Add approver</button>
                    </div>
                    <div>
                        <input
                            id="UpdateThreshold"
                            name="UpdateThreshold"
                            placeholder="Threshold"
                            type="number"
                            onChange={(event) =>
                                setThreshold(event.target.value)
                            }
                            value={threshold}
                        />
                        <button onClick={changeThreshold}>
                            Change threshold
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
