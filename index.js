const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const mediaServer = require("mediaserver");
const multer = require("multer"); /* es un middleware */

const optMulter = multer.diskStorage({
  /* opciones de como subir archivo */
  destination: function(req, file, cb) {
    cb(
      null,
      path.join(__dirname, "songs")
    ); /* paso null como 1 param por error first */
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: optMulter
}); /* instancio multer para alojar archivos*/

app.use(express.static("public"));
app.use(
  "/jquery",
  express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/songs", (req, res) => {
  fs.readFile(path.join(__dirname, "songs.json"), "utf8", (err, songs) => {
    if (err) throw err;
    res.json(JSON.parse(songs));
  });
});

app.get("/songs/:name", (req, res) => {
  var song = path.join(__dirname, "songs", req.params.name);
  mediaServer.pipe(
    req,
    res,
    song
  );
});

app.post("/songs", upload.single("song"), function(req, res) {
  /* song es el type del post del form */
  var songsApi = path.join(__dirname, "songs.json");
  var name =
    req.file.originalname; /* dejo el nombre original para la api .json */
  fs.readFile(songsApi, "utf8", function(err, file) {
    if (err) throw err;
    var songs = JSON.parse(file); /* leo el JSON y lo parseo a objeto*/
    songs.push({ nombre: name }); /* lo pusheo al JSON */
    fs.writeFile(songsApi, JSON.stringify(songs), function(err) {
      if (err) throw err;
      res.sendFile(path.join(__dirname, "index.html"));
    });
  });
});

app.listen(port, () => {
  console.log("Running");
});
