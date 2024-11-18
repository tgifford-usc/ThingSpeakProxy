import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// ThingSpeak API
const apiBase = "https://api.thingspeak.com/channels";

const generateURL = (base, channel, fieldNumber, api_key) => {
    return `${apiBase}/${channel}/fields/${fieldNumber}.json?api_key=${api_key}`;
}

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});


app.get("/", async (request, response) => {
    try {
        const channel = request.query.channel;
        const fieldNumber = request.query.fieldnum;
        const api_key = request.query.api_key;
        if (channel == undefined || fieldNumber == undefined || api_key == undefined) { 
            response.json({ message: "This API expects a GET request with URL parameters for channel, fieldnum, and api_key" });
            return;
        }        
        const url = generateURL(apiBase, channel, fieldNumber, api_key);
        const apiResponse = await fetch(url, {
          method: 'GET',
          headers: {
              Accept: "application/json",
          }
        });
        const result = await apiResponse.json();
        response.json(result);
    } catch(err) {
      console.log("Error processing thingspeak data request: ", err);
    }
});
