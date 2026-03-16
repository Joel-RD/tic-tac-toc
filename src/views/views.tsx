import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, SinglePlayer, MultiPlayer } from "./pages/pages";
import MainLayout from "../layouts/MainLayout";

const Pages = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/solo" element={<SinglePlayer />} />
                    <Route path="/multi" element={<MultiPlayer />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default Pages