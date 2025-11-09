import React, { Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Home = React.lazy(() => import(/* webpackChunkName: "Home" */ "@/pages/Home"))

const routes: Array<RouteObject> = [
     {
        path: "/home",
        element: <Suspense><Home /></Suspense>
    }
]

export default routes
