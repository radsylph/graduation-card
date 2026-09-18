import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename } from "node:path";

const outDir = ".tmp-svg";
mkdirSync(outDir, { recursive: true });

const files = process.argv.slice(2);

let sharp = null;
try {
    sharp = (await import("sharp")).default;
} catch {
    console.log("sharp not resolvable");
}

for (const file of files) {
    const svg = readFileSync(file, "utf8");
    const name = basename(file, ".svg");
    const stripped = svg.replace(/(data:image\/[a-z+]+;base64,)[A-Za-z0-9+/=]+/g, "$1<STRIP>");
    writeFileSync(`${outDir}/${name}_structure.txt`, stripped);

    const counts = {
        image: (svg.match(/<image\b/g) || []).length,
        mask: (svg.match(/<mask\b/g) || []).length,
        clipPath: (svg.match(/<clipPath\b/g) || []).length,
        path: (svg.match(/<path\b/g) || []).length,
        rect: (svg.match(/<rect\b/g) || []).length,
    };
    console.log(`\n### ${file} ${JSON.stringify(counts)} strippedLen=${stripped.length}`);

    const re = /<image\b[^>]*?>/g;
    let m;
    let i = 0;
    while ((m = re.exec(svg))) {
        const tag = m[0].replace(/base64,[A-Za-z0-9+/=]+/, "base64,<STRIP>");
        console.log(`  image[${i}] ${tag}`);
        const b64 = /base64,([A-Za-z0-9+/=]+)/.exec(m[0])?.[1];
        if (b64) writeFileSync(`${outDir}/${name}_img${i}.png`, Buffer.from(b64, "base64"));
        i++;
    }

    if (sharp) {
        try {
            await sharp(Buffer.from(svg), { density: 150 }).png().toFile(`${outDir}/${name}_render.png`);
            console.log(`  rendered -> .tmp-svg/${name}_render.png`);
        } catch (e) {
            console.log(`  render FAILED: ${e.message}`);
        }
    }
}
console.log(sharp ? "sharp available" : "sharp NOT available");
