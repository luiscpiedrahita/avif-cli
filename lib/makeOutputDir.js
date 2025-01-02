const fs = require("fs").promises;
const { constants } = require("fs");
async function makeOutputDir(outputDir) {
  if (outputDir) {
    try {
      await fs.access(outputDir, constants.W_OK);
      // console.log(outputDir + ": Directory exists");
    } catch (e) {
      // console.log(outputDir + ": " + e);
      try {
        await fs.mkdir(outputDir, { recursive: true });
        return true;
        // console.log("Directory created successfully!");
      } catch (err) {
        console.error(outputDir + ": " + err);
      }
    }
  }
}
module.exports = makeOutputDir;
