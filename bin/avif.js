#!/usr/bin/env node

const fs = require("fs").promises;
const { constants } = require("fs");
const convertPatternToPath = require("../lib/convertPatternToPath");
const makeOutputDir = require("../lib/makeOutputDir");
const {
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
} = require("../lib/cli");
const { glob } = require("tinyglobby");
const convert = require("../lib/convert");
let originalInput = "";

const avif = async () => {
  const files = await glob([input], { absolute: true });
  if (verbose) {
    process.stdout.write(`Found ${files.length} file(s) matching ${input}\n`);
  }
  await makeOutputDir(output);
  const results = await Promise.all(
    files.map((file, i) => {
      originalInput = i === 0 ? convertPatternToPath(input) : originalInput;
      convert({
        input: file,
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
      });
    })
  );
  // process.exit(results.every(Boolean) ? 0 : 1);
};
avif();
