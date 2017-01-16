const rp = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const config = require('../config/config');
const StolenArt = require('../models/stolen-art');
let url = 'http://uk.complex.com/style/2013/06/the-biggest-art-heists-of-all-time/';

mongoose.connect(config.db);


function runScrape(){
  rp(url)
  .then((body, response) => {
    const $ = cheerio.load(body);
    const next = $('.no-js-nav__next-page').attr('href');
    // console.log(next.replace(undefined, 'http://uk.complex.com'));
    url = next.replace(undefined, 'http://uk.complex.com');
    if(next) {
      runScrape();
    }
    if (url && url !== 'http://uk.complex.com/style/2013/06/the-biggest-art-heists-of-all-time/'){
      // const article = $('.story-content storycontent');
      const scrapedArticle = {
        artStolen: $('.list-slide__title').text(),
        description: $('.article__copy').find('p ~ p').text(),
        img: $('.lead-carousel__media').find('img').attr('src')
      };
      const extraInfo =  $('.article__copy').find('p:first-of-type').text();
      scrapedArticle.location = extraInfo.split('Location: ')[1].split(' Year:')[0];
      scrapedArticle.worth = extraInfo.split('Worth: ')[1];
      scrapedArticle.year = extraInfo.split('Year: ')[1].split(' Worth:')[0];
      scrapedArticle.artStolen = extraInfo.split('Stolen: ')[1].split(' Location:')[0];
      StolenArt.create(scrapedArticle, (err, stolenArt) => {
        if(err) return console.log(err);
        return console.log(`${stolenArt} - woohoo - it's in the database`);
      });

    }

  }).catch(console.error);
}

runScrape();
