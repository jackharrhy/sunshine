import { SlashCommand, CommandOptionType } from "slash-create";
import { Database } from "bun:sqlite";

const db = new Database("./sunshine.db");

const autocompleteStatement = db.query(
  `SELECT "Employee Name" FROM 'sunshine-list-2021' WHERE "Employee Name" LIKE ? LIMIT 10`
);

const runStatement = db.query(
  `SELECT "Employee Name", "Campus", "Job Title", "Base Salary", "Total Compensation" FROM 'sunshine-list-2021' WHERE "Employee Name" LIKE ? LIMIT 1`
);

export default class SearchCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: "search",
      description: "Search the sunshine list.",
      options: [
        {
          type: CommandOptionType.STRING,
          name: "name",
          description: "Test",
          required: true,
          autocomplete: true,
        },
      ],
    });

    this.filePath = __filename;
  }

  async autocomplete(ctx) {
    const focused = ctx.options[ctx.focused];
    const res = autocompleteStatement.all(`%${focused}%`);
    const options = res.map((row) => ({
      name: row["Employee Name"],
      value: row["Employee Name"],
    }));
    return options;
  }

  async run(ctx) {
    const name = ctx.options.name;
    const res = runStatement.get(`%${name}%`);
    return `\`\`\`${JSON.stringify(res, null, 2)}\`\`\``;
  }
}
