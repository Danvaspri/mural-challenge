import { BrowserRouter, Routes, Route } from "react-router-dom";

import WalletManager from "./components/multi-sign/multiSign";
import TransactionDetails from "./components/multi-sign/transaction";
import Transactions from "./components/multi-sign/transactions";
import { Home } from "./pages/home/home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/wallet" element={<WalletManager />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route
                    path="/transactions/:txHash"
                    element={<TransactionDetails />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
