import { useEffect, useState } from "react";
import { getTransactions } from "../../api/etherscan";

export default function UserModal({
    address,
    closeModal,
}: {
    address: string;
    closeModal: Function;
}) {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        getTransactions(address, "main").then((result) => {
            if (result) setTransactions(result);
        });
    }, [address]);

    return (
        <div
            onClick={() => {
                closeModal();
            }}
        >
            <table>
                <thead>
                    <tr>
                        <td>Number</td>
                        <td>Transaction Hash</td>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((each: any, index: number) => {
                        return (
                            <tr key={each.hash}>
                                <td>{index + 1}</td>
                                <td>{each.hash}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
