import { useEffect, useState } from "react";
import { getTopTenEns } from "../../api/etherscan";
import UserModal from "./modal";
export default function TableTopTen() {
    const [users, setUsers] = useState<Array<any>>([]);
    const [selectedAddress, setSelectedAdress] = useState("");
    useEffect(() => {
        loadUsers();
    }, []);
    async function loadUsers() {
        const usersENS = await getTopTenEns();
        if (usersENS) {
            setUsers(usersENS);
        }
    }
    function toggleModal(address: string) {
        setSelectedAdress(address);
    }
    function closeModal() {
        setSelectedAdress("");
    }
    return (
        <div>
            {users.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Name</th>
                            <th>Address</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user: any, index: number) => {
                            return (
                                <tr
                                    key={user.ens}
                                    onClick={() => {
                                        toggleModal(user.address);
                                    }}
                                >
                                    <td>{index + 1}</td>
                                    <td>{user.ens}</td>
                                    <td>{user.address}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            {selectedAddress && (
                <UserModal address={selectedAddress} closeModal={closeModal} />
            )}
        </div>
    );
}
