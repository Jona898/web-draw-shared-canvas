import { Request, Response } from "express";
import { ISvgCombined } from "web-draw-shared-canvas-shared";
import { SvgPathDao } from "../daos/SvgPath/SvgPathDao.mock";
import { SvgSettingsDao } from "../daos/SvgSettings/SvgSettingsDao.mock";
import { logger } from "../helpers/Logger";

export class SvgController {
  private svgSettingsDb: SvgSettingsDao;
  private svgPathDb: SvgPathDao;

  public constructor() {
    this.svgSettingsDb = new SvgSettingsDao();
    this.svgPathDb = new SvgPathDao();

    // logger.info({
    //   svgSettingsDb: this.svgSettingsDb,
    //   svgPathDb: this.svgPathDb,
    // });
  }

  public GetSvgComplete = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    logger.info("Get Svg Complete");
    logger.info({ svgSettingsDb: this.svgSettingsDb });

    const svgCombined: ISvgCombined = {
      svgSettings: await this.svgSettingsDb.getSettings(),
      svgPaths: await this.svgPathDb.getAll(),
    };

    res.send(svgCombined);
  };
}

export const svgController = new SvgController();
