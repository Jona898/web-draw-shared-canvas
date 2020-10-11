import { Router } from "express";
import { svgController } from "../controller";

const SvgRouter = Router();

SvgRouter.get("/svg", svgController.GetSvgComplete);

export { SvgRouter };
