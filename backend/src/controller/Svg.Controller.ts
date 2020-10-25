import { SvgPathDao } from "../daos/SvgPath/SvgPathDao.mock";
import { SvgSettingsDao } from "../daos/SvgSettings/SvgSettingsDao.mock";

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
}

export const svgController = new SvgController();
