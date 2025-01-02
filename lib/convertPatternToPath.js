const path = require("path");

function convertPatternToPath(pattern) {
  // Use path.join to create a platform-specific path
  const platformSpecificPath = path.resolve(pattern);

  // Normalize the path to remove any unnecessary pattens and separators
  return path.dirname(path.normalize(platformSpecificPath)).replace("/**", "");
}

module.exports = convertPatternToPath;
