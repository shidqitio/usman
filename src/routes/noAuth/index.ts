import express from "express";
const routes = express.Router();

const vers = "/v1"

import refAplikasi from "@routes/api/refAplikasi-route"

routes.use(vers + "/noAuth/aplikasi", refAplikasi)

export default routes;