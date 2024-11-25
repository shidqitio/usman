import express from "express";
const routes = express.Router();

const vers = "/v1"

//VERSION 1
import example from "@routes/api/example-route";
import refAplikasi from "@routes/api/refAplikasi-route"
import refAplikasiKey from "@routes/api/refAplikasiKey-routes"
import refGroup from "@routes/api/refGroup-route"
import refMenu1 from "@routes/api/refMenu1-route"
import refMenu2 from "@routes/api/refMenu2-route"
import refMenu3 from "@routes/api/refMenu3-route"
import trxGroupUser from "@routes/api/trxGroupUser-route"
import trxGroupMenu from "@routes/api/trxGroupMenu-route"
import akses from "@routes/api/akses-route"
import refUser from "@routes/api/refUser-route"
import refLevel from "@routes/api/refLevel-routes"
import jabatan from "@routes/api/refJabatan-route"
import {auth, authSecretKey} from "@middleware/auth";
// routes.use("/v1", example);

routes.use(vers + "/aplikasi", auth, refAplikasi)

routes.use(vers + "/aplikasi-key", authSecretKey, refAplikasiKey)

routes.use(vers + "/group", auth, refGroup);

routes.use(vers + "/menu1", auth, refMenu1);

routes.use(vers + "/menu2", auth, refMenu2);

routes.use(vers + "/menu3", auth, refMenu3);

routes.use(vers + "/trx-groupuser", auth, trxGroupUser)

routes.use(vers + "/trx-groupmenu", auth,trxGroupMenu)

routes.use(vers + "/jabatan", auth, jabatan )

routes.use(vers + "/akses", akses)

routes.use(vers + "/users", refUser)

routes.use(vers + "/level", refLevel)

export default routes;
