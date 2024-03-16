import express from "express";
const routes = express.Router();

//VERSION 1
import example from "@routes/api/example-route";
import refAplikasi from "@routes/api/refAplikasi-route"
import refGroup from "@routes/api/refGroup-route"

// routes.use("/v1", example);

routes.use("/v1/aplikasi", refAplikasi)

routes.use("/v1/group", refGroup);

export default routes;
