import fs from "node:fs";
import path from "node:path";

interface Command {
  name: string;
  description: string;
  command: any;
  dataJson: any;
}

export const getCommands = async () => {
  const commands: Command[] = [];
  const foldersPath = path.join(path.dirname(__dirname), "commands");
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);

      if ("data" in command && "execute" in command) {
        commands.push({
          name: command.data.name,
          description: command.data.description,
          command,
          dataJson: command.data.toJSON(),
        });
      }
      else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  return commands;
};
