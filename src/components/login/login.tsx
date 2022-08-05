import { useEffect, useState } from "react";
import Web3 from "web3";
import { getTransactions } from "../../api/etherscan";
async function connect(onConnected: Function) {
    if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });

    onConnected(accounts[0]);
}

async function checkIfWalletIsConnected(
    onConnected: Function,
    onTransactions: Function,
    onBalance: Function
) {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length > 0) {
            const account = accounts[0];
            const transactions = await getTransactions(account, "rinkeby");
            const web3 = new Web3(window.ethereum);
            const balanceWei = await web3.eth.getBalance(account);
            onBalance(web3.utils.fromWei(balanceWei, "ether"));
            onTransactions(transactions);
            onConnected(account);

            return;
        }
    }
}

export default function Web3Auth() {
    const [userAddress, setUserAddress] = useState("");
    const [userTransactions, setUserTransactions] = useState([]);
    const [userBalance, setUserBalance] = useState(0);
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        checkIfWalletIsConnected(
            setUserAddress,
            setUserTransactions,
            setUserBalance
        );
    }, []);
    const handleSendEth = (event: any) => {
        event.preventDefault();
        payAddress(userAddress, toAddress, amount);
        setToAddress("");
        setAmount("");
    };
    async function payAddress(
        sender: string,
        receiver: string,
        strEther: string
    ) {
        try {
            const params = {
                from: sender,
                to: receiver,
                value: strEther,
                gas: 39000,
            };
            const web3 = new Web3(window.ethereum);
            const sendHash = await web3.eth.sendTransaction(params);
            console.log("txnHash is " + sendHash);
        } catch (e) {
            console.log("payment fail!");
            console.log(e);
        }
    }

    return userAddress ? (
        <div>
            <div>Connected with {userAddress} </div>
            <div>{userBalance} Ether</div>
            <table>
                <thead>
                    <tr>
                        <th>Transaction Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {userTransactions.map((each: any) => (
                        <tr key={each.hash}>
                            <td>
                                <a href={each.link}>{each.hash}</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <form onSubmit={handleSendEth}>
                    <input
                        id="toAddress"
                        name="toAddress"
                        placeholder="address"
                        type="text"
                        onChange={(event) => setToAddress(event.target.value)}
                        value={toAddress}
                    />
                    <input
                        id="amount"
                        name="amount"
                        type="text"
                        placeholder="wei"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />

                    <button type="submit">Send Eth</button>
                </form>
            </div>
        </div>
    ) : (
        <button onClick={() => connect(setUserAddress)}>
            Connect to MetaMask
        </button>
    );
}
