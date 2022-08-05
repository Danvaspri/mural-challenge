import { useEffect, useState } from "react";
import Approvers from "./approvers";
import CreateWallet from "./createWallet";

export default function WalletManager() {
    const [createWallet, setCreateWallet] = useState(false);
    const [safe, setSafe] = useState("");
    useEffect(() => {
        const localSafe = localStorage.getItem("safe");

        if (localSafe) {
            setSafe(localSafe);
        }
    }, []);

    function closeCreateWallet() {
        setCreateWallet(false);
    }
    return (
        <div>
            {createWallet && (
                <CreateWallet close={closeCreateWallet} onSafe={setSafe} />
            )}

            {!createWallet && (
                <>
                    <button onClick={() => setCreateWallet(true)}>
                        Create new Multi-Sig Wallet
                    </button>
                    <Approvers safeAddress={safe} />
                </>
            )}
        </div>
    );
}
