const AdmZip = require("adm-zip");

const zip = new AdmZip();

const files = [
  {
    type: "file",
    directory: "manifest.json"
  },
  {
    type: "folder",
    directory: "dist"
  }
];

files.forEach(file => {
  switch (file.type) {
    case "file":
      console.log(file);
      zip.addLocalFile(file.directory);
      break;
    case "folder":
      zip.addLocalFolder(file.directory, "dist");
  }
});
// zip.extractAllTo("stop-netflix-auto.zip", true);
zip.writeZip("files.zip");
