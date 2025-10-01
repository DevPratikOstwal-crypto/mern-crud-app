import { Parser } from "json2csv";

export const toCSV = (rows) => {
  const fields = [
    "_id",
    "firstName",
    "lastName",
    "email",
    "mobile",
    "gender",
    "status",
    "location",
    "createdAt",
    "updatedAt",
  ];
  const parser = new Parser({ fields });
  return parser.parse(rows);
};
