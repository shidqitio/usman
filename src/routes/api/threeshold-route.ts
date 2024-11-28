import express from "express"
import validate from "@schema/validate"
import refThreesholdController from "@controllers/api/threeshold-controller"

const routes = express.Router()

routes.post("/nominal", refThreesholdController.getThreesholdByNominal)

routes.post("/nominal-jenis", refThreesholdController.getThreesholdByNominalandJenisPengadaan)

export default routes