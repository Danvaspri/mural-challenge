import TableTopTen from "../../components/ensTopTen/tableTopTen";
import Web3Auth from "../../components/login/login";
export function Home() {
    return (
        <>
            <Web3Auth />
            <TableTopTen />
        </>
    );
}
