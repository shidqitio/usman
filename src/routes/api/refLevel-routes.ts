import express from "express"
import validate from "@schema/validate"
import refLevelController from "@controllers/api/refLevel-controller"

const routes = express.Router()

routes.get("/", refLevelController.index)

export default routes