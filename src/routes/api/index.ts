import express from "express";
const routes = express.Router();

const vers = "/v1"

//VERSION 1
import example from "@routes/api/example-route";
import refAplikasi from "@routes/api/refAplikasi-route"
import refGroup from "@routes/api/refGroup-route"
import refMenu1 from "@routes/api/refMenu1-route"
import refMenu2 from "@routes/api/refMenu2-route"
import refMenu3 from "@routes/api/refMenu3-route"
import trxGroupUser from "@routes/api/trxGroupUser-route"
import trxGroupMenu from "@routes/api/trxGroupMenu-route"
import akses from "@routes/api/akses-route"
import refUser from "@routes/api/refUser-route"
import refLevel from "@routes/api/refLevel-routes"
import auth from "@middleware/auth";
// routes.use("/v1", example);

routes.use(vers + "/aplikasi",auth, refAplikasi)

routes.use(vers + "/group", refGroup);

routes.use(vers + "/menu1", refMenu1);

routes.use(vers + "/menu2", refMenu2);

routes.use(vers + "/menu3", refMenu3);

routes.use(vers + "/trx-groupuser", trxGroupUser)

routes.use(vers + "/trx-groupmenu", trxGroupMenu)

routes.use(vers + "/level", refLevel )

routes.use(vers + "/akses", akses)

routes.use(vers + "/users", refUser)

export default routes;
