import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Master = lazy(() => import('@/Routes/Master'));
const NotFound = lazy(() => import('@/Routes/NotFound'));
// const ServerError = lazy(() => import('@/Routes/ServerError'));
const PrivateDecryption = lazy(() => import('@/Routes/PrivateDecryption'));

export default function RouterHandler() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Master />} />
            <Route path="/encryption/:short" element={<PrivateDecryption />} />
            <Route path="/c/u" element={<Master isBookmarkCreate />} />
            <Route path="/analysis/:short" element={<p>test</p>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>;
}