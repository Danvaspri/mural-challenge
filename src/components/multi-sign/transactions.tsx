import { useEffect, useState } from "react";

export default function Transactions() {
    const [safe, setSafe] = useState("");
    useEffect(() => {
        const localSafe = localStorage.getItem("safe");

        if (localSafe) {
            setSafe(localSafe);
        }
    }, []);
    return (
        <div>
            {safe && `Safe address: ${safe}`}
            {!safe && `Safe address not found`}
        </div>
    );
}
