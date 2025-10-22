import fs from "fs";
import path from "path";
import crypto from "crypto";
import versions from "../policies/versions.json";

export function getPrivacyData(lang: string) {
  const version = versions.current_version;

  // Determine path based on language
  const filePath = path.resolve(`src/policies/privacy.${lang}.md`);
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Generate SHA256 hash
  const hash = crypto.createHash("sha256").update(fileContent).digest("hex");

  return {
    version,
    hash,
    fullText: fileContent,
  };
}
