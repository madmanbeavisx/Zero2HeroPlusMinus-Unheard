import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { readFileSync } from "fs";
import { join } from "path";

class Mod implements IPostDBLoadMod
{
    public logger: ILogger;
    private modName = "ZtH+- Unheard Edition";
    private credit = "Joey's Zero to Hero++ Unheard Edition";
    private profileName = `MadManBeavis' ${this.modName}`;

    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.logger = logger;
        
        const tables = databaseServer.getTables();
        
        const UnheardProfile = tables.templates.profiles["Unheard"];
        const zthProfile = JSON.parse(JSON.stringify(UnheardProfile));
        const bearInventoryData = JSON.parse(readFileSync(join(__dirname, "./bear_inventory.json"), "utf-8"));
        const usecInventoryData = JSON.parse(readFileSync(join(__dirname, "./usec_inventory.json"), "utf-8"));
        const traderStanding = JSON.parse(readFileSync(join(__dirname, "./traders.json"), "utf-8"));
        const description = JSON.parse(readFileSync(join(__dirname, "./descLocale.json"), "utf-8"));
        const skill_issue = JSON.parse(readFileSync(join(__dirname, "./skill_issue.json"), "utf-8"));
        
        zthProfile.bear.character.Inventory = bearInventoryData;
        zthProfile.usec.character.Inventory = usecInventoryData;
        zthProfile.bear.trader = traderStanding;
        zthProfile.usec.trader = traderStanding;
        zthProfile.descriptionLocaleKey = description;
        zthProfile.bear.character.Skills = skill_issue;
        zthProfile.usec.character.Skills = skill_issue;

        tables.templates.profiles[this.profileName] = zthProfile;

        this.displayCredits();
    }

    private displayCredits() {
        this.logger.log(`[${this.modName}] ** ${this.modName}`, LogTextColor.CYAN);
        this.logger.log(`[${this.modName}] ** Developer: MadManBeavis`, LogTextColor.CYAN);
        this.logger.log(`[${this.modName}] ** Credit goes to Joey for his ${this.credit}`, LogTextColor.CYAN);
    } 
}

module.exports = { mod: new Mod() };