import express from "express"
import validate from "@schema/validate"
import refMetodePengadaanController from "@controllers/api/refMetodePengadaan-controller"

const routes = express.Router()

routes.get("/", refMetodePengadaanController.metodePengadaan)

export default routes