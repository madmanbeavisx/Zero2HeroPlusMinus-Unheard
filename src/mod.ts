import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { readFileSync } from "fs";
import { join } from "path";

class Mod implements IPostDBLoadMod {
    public logger: ILogger;
    private modName = "ZtH+- Unheard Edition";
    private credit = "Joey's Zero to Hero++ Unheard Edition";
    private profileName = `MadManBeavis' ${this.modName}`;

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.logger = logger;

        const tables = databaseServer.getTables();

        const config = JSON.parse(readFileSync(join(__dirname, "../config" + "/config.json"), "utf-8"));

        this.displayCredits();

        const unheardProfile = tables.templates.profiles["Unheard"];
        const newProfile = JSON.parse(JSON.stringify(unheardProfile));
        const traderStanding = JSON.parse(readFileSync(join(__dirname, "./traders.json"), "utf-8"));
        const skillIssue = JSON.parse(readFileSync(join(__dirname, "./skill_issue.json"), "utf-8"));

        let bearInventoryData: any
        let usecInventoryData: any
        let description: any

        if (config.enableUnheardPocketZise) {

            this.logger.log(`[${this.modName}] Creating new profile with Unheard pockets.`, LogTextColor.CYAN)

            bearInventoryData = JSON.parse(readFileSync(join(__dirname, "./inventory/unheard_pockets_bear_inventory.json"), "utf-8"));
            usecInventoryData = JSON.parse(readFileSync(join(__dirname, "./inventory/unheard_pockets_usec_inventory.json"), "utf-8"));
            description = JSON.parse(readFileSync(join(__dirname, "./locales/unheard_pockets_descLocale.json"), "utf-8"));

            newProfile.bear.character.Inventory = bearInventoryData;
            newProfile.usec.character.Inventory = usecInventoryData;
            newProfile.bear.trader = traderStanding;
            newProfile.usec.trader = traderStanding;
            newProfile.descriptionLocaleKey = description;
            newProfile.bear.character.Skills = skillIssue;
            newProfile.usec.character.Skills = skillIssue;

            tables.templates.profiles[this.profileName] = newProfile;
        } else {

            this.logger.log(`[${this.modName}] Creating new profile with Standard pockets.`, LogTextColor.CYAN)
            
            bearInventoryData = JSON.parse(readFileSync(join(__dirname, "./inventory/standard_pockets_bear_inventory.json"), "utf-8"));
            usecInventoryData = JSON.parse(readFileSync(join(__dirname, "./inventory/standard_pockets_usec_inventory.json"), "utf-8"));
            description = JSON.parse(readFileSync(join(__dirname, "./locales/standard_pockets_descLocale.json"), "utf-8"));

            newProfile.bear.character.Inventory = bearInventoryData;
            newProfile.usec.character.Inventory = usecInventoryData;
            newProfile.bear.trader = traderStanding;
            newProfile.usec.trader = traderStanding;
            newProfile.descriptionLocaleKey = description;
            newProfile.bear.character.Skills = skillIssue;
            newProfile.usec.character.Skills = skillIssue;

            tables.templates.profiles[`${this.profileName} Standard Pockets`] = newProfile;
        }

        
    }

    private displayCredits() {
        this.logger.log(`[${this.modName}] ** ${this.modName}`, LogTextColor.CYAN);
        this.logger.log(`[${this.modName}] ** Developer: MadManBeavis`, LogTextColor.CYAN);
        this.logger.log(`[${this.modName}] ** Credit goes to Joey for his ${this.credit}`, LogTextColor.CYAN);
    }
}

module.exports = { mod: new Mod() };