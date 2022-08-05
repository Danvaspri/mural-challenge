import Web3 from "web3";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";

const web3 = new Web3(window.ethereum);
export async function createAdapter() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length > 0) {
            const account = accounts[0];
            const ethAdapter = new Web3Adapter({
                web3,
                signerAddress: account,
            });

            return ethAdapter;
        }
    }
}
