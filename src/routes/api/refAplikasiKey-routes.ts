import express from "express";
import refAplikasiController from "@controllers/api/refAplikasi-controller";
const routes = express.Router()

routes.get("/:nama_aplikasi", refAplikasiController.getAplikasiByNamaAplikasi)

export default routes