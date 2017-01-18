const rp = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const config = require('../config/config');
const StolenArt = require('../models/stolen-art');
let url = 'http://uk.complex.com/style/2013/06/the-biggest-art-heists-of-all-time/';

mongoose.connect(config.db);

StolenArt.collection.drop();

function runScrape(){
  rp(url)
  .then(body => {
    const $ = cheerio.load(body);
    const next = $('.no-js-nav__next-page').attr('href');

    url = next.replace(undefined, 'http://uk.complex.com');
    if (next) {
      setTimeout(runScrape, 1500);
    } else {
      return;
    }

    if (url && url !== 'http://uk.complex.com/style/2013/06/the-biggest-art-heists-of-all-time/'){
      // const artStolen   = $('.list-slide__title').text();
      const capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const description = $('.article__copy').find('p ~ p').text();
      const image       = $('.lead-carousel__media').find('img').attr('src');
      const extraInfo   = $('.article__copy').find('p:first-of-type').text();
      const location    = extraInfo.split('Location: ')[1].split(' Year:')[0];
      const worth       = extraInfo.split('Worth: ')[1];
      const year        = extraInfo.split('Year: ')[1].split(' Worth:')[0];
      let artStolen     = extraInfo.split('Stolen: ')[1].split(' Location:')[0];
      artStolen = artStolen.split(' ');
      for (var i = 0; i < artStolen.length; i++){
        for (var j = 0; j < capitals.length; j++){
          if(artStolen[i].lastIndexOf(capitals[j]) > 0 && artStolen[i][artStolen[i].lastIndexOf(capitals[j]) - 1] !== '-' && artStolen[i][artStolen[i].lastIndexOf(capitals[j]) - 1] !== '.'){
            var index = artStolen[i].lastIndexOf(capitals[j]);
            artStolen[i] = artStolen[i].split('');
            artStolen[i].splice(index, 0, '\n');
            artStolen[i] = artStolen[i].join('');
            continue;
          }
        }
      }
      artStolen = artStolen.join(' ');

      const scrapedArticle = {
        artStolen,
        description,
        image,
        location,
        worth,
        year
      };

      StolenArt.create(scrapedArticle, (err, stolenArt) => {
        if (err) return console.log(err);
        return console.log(`${stolenArt} - woohoo - it's in the database`);
      });
    }
  })
  .catch(console.error);
}

runScrape();
