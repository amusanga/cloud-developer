import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
const axios = require('axios');


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req, res) => {
    const image_url = req.query.image_url as string;
    let filteredImagepath: string;

    axios.get(image_url)
      .then(async function (response: object) {

        filteredImagepath = await filterImageFromURL(image_url);

        if (filteredImagepath === 'error') {
          return res.status(400).send("Image filtering failed");
        }

        res.status(201).sendFile(filteredImagepath, {}, () => deleteLocalFiles([filteredImagepath]));
      })
      .catch(function (error: object) {

        return res.status(400).send("Invalid image URL");
      })
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();