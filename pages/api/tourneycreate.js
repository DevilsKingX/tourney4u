const { createCanvas, loadImage } = require('canvas');

module.exports = async function (req, res) {
  // Check if password is correct
  var { game,bg,password, hexCode,style } = req.query;
  let gameAliases=[
    {word:'valorant',aliases:['val','valo']},
    {word:'pubg',aliases:['pubgm','battleground']},
  ]

  if(game){
    gameAliases.forEach(({word,aliases})=>{
        aliases.forEach((alias)=>{
            if(alias==game)
            game=word;
        })
    })
  }
  if (password !== 'apwinwab') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Create a canvas and set its dimensions
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');
  hexCode=hexCode?hexCode:'ED1055'
  game=game?game:'valorant'
  bg=bg?bg:'bind'
  style=style?style:'vct'

  try {
    // Load the background image from a URL
    console.log('Loading background image')
    const backgroundImage = await loadImage(`TourneyFiles/games/${game}/${bg}.png`);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Load the foreground image from a URL
    const foregroundImage = await loadImage(`TourneyFiles/brackets/${style}.png`);
    ctx.drawImage(foregroundImage, 0, 0, canvas.width, canvas.height);

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
    return res.status(500).json({ error: 'Internal Server Error:'+error });
  }
};
