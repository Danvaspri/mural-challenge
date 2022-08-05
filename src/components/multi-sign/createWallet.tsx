import { useEffect, useState } from "react";
import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";

import { createAdapter } from "./adapter";

export default function CreateWallet({
    close,
    onSafe,
}: {
    close: Function;
    onSafe: Function;
}) {
    const [approvers, setApprovers] = useState<any>({});

    const [address, setAddress] = useState("");
    const [nickname, setNickname] = useState("");
    const [treshold, setTreshold] = useState(0);

    useEffect(() => {
        if (window.ethereum) {
            const safeLocal = localStorage.getItem("safe");
            if (safeLocal) {
                onSafe(safeLocal);
            }
            window.ethereum
                .request({
                    method: "eth_accounts",
                })
                .then((accounts: any) => {
                    const localOwners = JSON.parse(
                        localStorage.getItem("ownersBook") || ""
                    );

                    let nick = "";
                    if (localOwners && localOwners[accounts[0].toLowerCase()]) {
                        nick = localOwners[accounts[0].toLowerCase()];
                    }

                    setNickname(nick);

                    setAddress(accounts[0]);
                });
        }
    }, [onSafe]);

    async function createMultiSignWallet(owners: any, threshold: any) {
        let shallowOwners = { ...owners };
        if (nickname && address) {
            shallowOwners[address] = nickname;
        }
        const safeAccountConfig: SafeAccountConfig = {
            owners: Object.keys(shallowOwners),
            threshold,
        };
        const ethAdapter = await createAdapter();
        if (ethAdapter !== undefined) {
            const safeFactory = await SafeFactory.create({ ethAdapter });
            const safeSdk: Safe = await safeFactory.deploySafe({
                safeAccountConfig,
            });
            const newSafeAddress = safeSdk.getAddress();
            onSafe(newSafeAddress);
            let localApprovers: any = localStorage.getItem("ownersBook");
            if (localApprovers) {
                localApprovers = JSON.parse(localApprovers);
                Object.keys(shallowOwners).forEach((each) => {
                    localApprovers[each.toLowerCase()] = shallowOwners[each];
                });
                localStorage.setItem(
                    "ownersBook",
                    JSON.stringify(localApprovers)
                );
            } else {
                localApprovers = {};
                Object.keys(shallowOwners).forEach((each) => {
                    localApprovers[each.toLowerCase()] = shallowOwners[each];
                });
                localStorage.setItem(
                    "ownersBook",
                    JSON.stringify(localApprovers)
                );
            }

            localStorage.setItem("safe", newSafeAddress);
        }
    }

    function addApprover(event: any) {
        event.preventDefault();
        if (!address || !nickname) return;

        setApprovers((approvers: any) => {
            let newApprover: any = {};
            newApprover[address] = nickname;
            return { ...approvers, ...newApprover };
        });
        setAddress("");
        setNickname("");
    }
    function setNicknameList(event: string, addr: string) {
        setApprovers((approvers: any) => {
            let newApprover: any = {};
            newApprover[addr] = event;

            return { ...approvers, ...newApprover };
        });
    }
    function setAddressList(event: any, addr: string) {
        setApprovers((approvers: any) => {
            if (event === "") {
                const newApprovers = { ...approvers };

                delete newApprovers[addr];

                return { ...newApprovers };
            }
            let nickname: any = approvers[addr];
            let newApprover: any = {};
            newApprover[event] = nickname;
            delete approvers[addr];

            return { ...approvers, ...newApprover };
        });
    }
    return (
        <div>
            <input
                id="Treshold"
                name="Treshold"
                placeholder="Treshold"
                type="number"
                onChange={(event) => setTreshold(parseInt(event.target.value))}
                value={treshold}
            />
            <table>
                <thead>
                    <tr>
                        <th>NickName</th>

                        <th>Approver</th>
                    </tr>
                </thead>
                <tbody>
                    {approvers &&
                        Object.keys(approvers).map((each: any) => (
                            <tr key={each}>
                                <td>
                                    <input
                                        id={`Nickname${each}`}
                                        name="NickName"
                                        placeholder="NickName"
                                        type="text"
                                        onChange={(event) =>
                                            setNicknameList(
                                                event.target.value,
                                                each
                                            )
                                        }
                                        value={approvers[each]}
                                    />
                                </td>
                                <td>
                                    <input
                                        id={`Address${each}`}
                                        name="Address"
                                        placeholder="address"
                                        type="text"
                                        onChange={(event) =>
                                            setAddressList(
                                                event.target.value,
                                                each
                                            )
                                        }
                                        value={each}
                                    />
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td>
                            <input
                                id={`Nickname`}
                                name="NickName"
                                placeholder="NickName"
                                type="text"
                                onChange={(event) =>
                                    setNickname(event.target.value)
                                }
                                value={nickname}
                            />
                        </td>
                        <td>
                            <input
                                id={`Address`}
                                name="Address"
                                placeholder="address"
                                type="text"
                                onChange={(event) =>
                                    setAddress(event.target.value)
                                }
                                value={address}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={addApprover}>Add Approver</button>

            <button onClick={() => createMultiSignWallet(approvers, treshold)}>
                Create Wallet
            </button>

            <button onClick={() => close()}>Close</button>
        </div>
    );
}
