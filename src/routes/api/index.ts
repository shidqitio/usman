import express from "express";
const routes = express.Router();

//VERSION 1
import example from "@routes/api/example-route";
import refAplikasi from "@routes/api/refAplikasi-route"
import refGroup from "@routes/api/refGroup-route"
import refMenu1 from "@routes/api/refMenu1-route"
import refMenu2 from "@routes/api/refMenu2-route"

// routes.use("/v1", example);

routes.use("/v1/aplikasi", refAplikasi)

routes.use("/v1/group", refGroup);

routes.use("/v1/menu1", refMenu1);

routes.use("/v1/menu2", refMenu2);

export default routes;
