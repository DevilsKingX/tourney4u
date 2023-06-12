const { createCanvas, loadImage } = require('canvas');
const { promisify } = require('util');

const loadImageAsync = promisify(loadImage);

module.exports = async function (req, res) {
  console.log('Request received')
  // Check if password is correct
  var { game,bg,password, hexCode } = req.query;
  if (password !== 'apwinwab') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Create a canvas and set its dimensions
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');
  game=game?game:'valorant'
  bg=bg?bg:'bind'

  try {
    // Load the background image from a URL
    

    // Apply color composition operation to change the hue based on the provided hex value
    ctx.globalCompositeOperation = 'multiply';
    console.log(hexCode)
    ctx.fillStyle = "#"+hexCode;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a buffer
    const buffer = canvas.toBuffer('image/png');

    // Set the appropriate headers and return the image buffer as the response
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
