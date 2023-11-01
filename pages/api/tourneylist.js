import fs from 'fs';
import path from 'path';


function getFilePaths(dir) {
  const fileNames = fs.readdirSync(dir);
  let filePaths = [];

  fileNames.forEach(fileName => {
    const filePath = path.join(dir, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      filePaths.push(filePath);
    } else if (stats.isDirectory()) {
      const subDirFilePaths = getFilePaths(filePath);
      filePaths = filePaths.concat(subDirFilePaths);
    }
  });

  return filePaths;
}


module.exports = async function(req, res) {
  // Check if password is correct
  var { game } = req.query;
  let gameAliases = [
    { word: 'valorant', aliases: ['val', 'valo'] },
    { word: 'pubg', aliases: ['pubgm', 'battleground'] },
  ]

  if (game) {
    gameAliases.forEach(({ word, aliases }) => {
      aliases.forEach((alias) => {
        if (alias == game)
          game = word;
      })
    })
  }
  const brackets = getFilePaths('TourneyFiles/games')
  let games = []
  brackets.forEach((bracket) => {
    if (!games.includes(bracket.substring(bracket.indexOf('games/') + 6, bracket.lastIndexOf('/'))))
      games.push(bracket.substring(bracket.indexOf('games/') + 6, bracket.lastIndexOf('/')))
  })

  if (!game) {
    let message = `Here is the list of available games for tourney brackets.\n* \`` + games.join('\`\n* \`') + '`'
    return res.status(200).json({ response: message })
  }
  else if (game == 'brackets') {
    const bracketsFolder = getFilePaths('TourneyFiles/brackets')
    const brackets = bracketsFolder.map(key => key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.png')))
    let message = `Here is the list of available styles for tourney brackets.\n* \`` + brackets.join('\`\n* \`') + '`'
    return res.status(200).json({ response: message })
  }
  else if (!games.includes(game)) {
    let message = `The Game Name Provided (${game}) is not available. Please check the list of available games below.\n* \`` + games.join('\`\n* \`') + '`'
    return res.status(200).json({ response: message })
  }
  else {
    let mapsList = []
    brackets.forEach((bracket) => {
      if (bracket.startsWith(`TourneyFiles/games/${game}/`))
        mapsList.push(bracket.substring(bracket.lastIndexOf('/') + 1, bracket.lastIndexOf('.png')))
    })
    let message = `Here is the list of available backgrounds for tourney brackets of ${game}.\n* \`` + mapsList.join('\`\n* \`') + '`'
    return res.status(200).json({ response: message })
  }
}