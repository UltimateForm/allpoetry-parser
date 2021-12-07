import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const source = await fs.readFileSync(path.resolve(__dirname, "allpoetry.html"), "utf-8");
const poem_divs_regex = new RegExp(/(?<=<div class="p" style="page-break-after:always">)((.|\n)*?)(?=<\/div>)/, "mg");
let allMatches = [];
const simpleMatcher = source.matchAll(poem_divs_regex);
for (const match of simpleMatcher) {
	allMatches.push(match[0]);
}


function getTitle(input) {
	return input.match(/(?<=<h2 class="title" style="margin-bottom: 2px;padding-left:0">)((.|\n)*?)(?=<\/h2>)/mg)[0];
}

function getDate(input) {
	return input.match(/(?<=by lyra -w\.d\. on )((.|\n)*?)(?=.&nbsp;)/mg)[0]
}

function getBody(input) {
	const rawBody = input.match(/(?<=<div class="body">)((.|\n)*?)$/)[0].replaceAll("<br>", "");
	const lines = rawBody.split("\n");
	const cleanedLines = lines.map(l => l.trimStart());
	return cleanedLines.join("\n")
}

const poemsArr = [];

allMatches.forEach(poemExtract => {
	const date = getDate(poemExtract);
	const title = getTitle(poemExtract);
	const body = getBody(poemExtract);
	poemsArr.push({
		date,
		title,
		body
	})
});

fs.writeFileSync("poems.json", JSON.stringify(poemsArr));
console.log("Written poems to poems.json");