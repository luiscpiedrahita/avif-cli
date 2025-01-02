const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const makeOutputDir = require("../lib/makeOutputDir");

module.exports = async ({
  input,
  output,
  lossless,
  quality,
  effort,
  chromaSubsampling,
  keepMetadata,
  overwrite,
  appendExt,
  verbose,
  originalInput,
}) => {
  let outputFilename,
    dir,
    outputDir = null;
  if (typeof input !== undefined) {
    outputFilename = path.basename(input);
    if (typeof originalInput !== undefined) {
      dir = path.dirname(input).replace(originalInput?.toString(), "");
    }
  }

  if (appendExt) {
    outputFilename = outputFilename + ".avif";
  } else {
    outputFilename = outputFilename.replace(path.extname(input), ".avif");
  }
  const outputPath = path.join(
    output ? output + dir + "/" : path.dirname(input),
    outputFilename
  );
  // outputDir: is the containing folder for the current image file

  outputDir = output ? output : "./" + dir + "/";
  await makeOutputDir(outputDir);
  try {
    const exists = (await fs.stat(outputPath)).isFile();

    if (exists && !overwrite) {
      if (verbose) {
        process.stdout.write(`already exists: ${outputPath}\n`);
      }
      return true;
    }
  } catch (e) {
    // process.stderr.write(`${input}: ${e.message}\n`);
  }

  try {
    const pipeline = sharp(input).avif({
      quality,
      effort,
      lossless,
      chromaSubsampling,
    });
    if (keepMetadata) {
      pipeline.keepMetadata();
    }
    await pipeline.toFile(outputPath);
    if (verbose) {
      process.stdout.write(`created: ${outputPath}\n`);
    }
    return true;
  } catch (err) {
    process.stderr.write(`${input}: ${err.message}\n`);
    return false;
  }
};
