import * as fs from "fs";
import * as path from "path";

const srcDir = path.resolve(__dirname, "../src");

// Function to check if file contains 'export default'
const hasDefaultExport = (filePath: string): boolean => {
	const content = fs.readFileSync(filePath, "utf-8");
	return content.includes("export default");
};

// Function to generate index.ts
const generateIndexFile = (dirPath: string) => {
	const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".ts") && file !== "index.ts" && !file.includes(".styles."));
	const imports: string[] = [];
	const exports: string[] = [];

	files.forEach((file) => {
		const filePath = path.join(dirPath, file);
		if (hasDefaultExport(filePath)) {
			const fileName = path.basename(file, ".ts");
			imports.push(`import ${fileName} from "./${fileName}";`);
			exports.push(fileName);
		}
	});

	if (imports.length > 0) {
		const indexContent = `${imports.join("\n")}

export default {
  ${exports.join(",\n  ")},
};`;

		fs.writeFileSync(path.join(dirPath, "index.ts"), indexContent, "utf-8");
		console.log(`Generated index.ts in ${dirPath}`);
	}
};

// Function to start the process
const generateIndexes = (baseDir: string) => {
	const getDirectories = (dir: string): string[] => {
		const subdirs = fs
			.readdirSync(dir)
			.map((subdir) => path.join(dir, subdir))
			.filter((subdirPath) => fs.statSync(subdirPath).isDirectory());
		return subdirs.reduce((acc: string[], subdir) => acc.concat(subdir, getDirectories(subdir)), []);
	};

	const directories = [baseDir, ...getDirectories(baseDir)];

	console.log("Directories", directories);

	directories.forEach((dir) => {
		console.log(`Generating index.ts in ${dir}`);
		generateIndexFile(dir);
	});
};

// Start

// Start generating index.ts files
generateIndexes(srcDir);
