const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing TikTok URL" });
  }

  try {
    const response = await axios.post(
      "https://snaptik.app/action.php",
      new URLSearchParams({ url }),
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    const $ = cheerio.load(response.data);
    const downloadLink = $("a.download-link").attr("href");

    if (downloadLink) {
      res.json({ download: downloadLink });
    } else {
      res.status(404).json({ error: "No download link found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Scraping failed" });
  }
};
