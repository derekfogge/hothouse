const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });
const cheerio = require('cheerio');
const simpleGit = require('simple-git');
const fs = require('fs');
const url = 'https://www.hothousejazz.com/calendar.php';

// go to Hothouse's calendar, wait for page to load, and fetch page contents
nightmare
  .goto(url)
  .wait('div#getEvent > a.evcal_list_a')
  .evaluate(() => document.querySelector('body').innerHTML)
  .end()
  .then(response => {
    console.log(getData(response));
    fs.writeFileSync('hothouse.json', JSON.stringify(getData(response, null, 2)));
  }).catch(err => {
    console.log(err);
  });



// parse data from #getEvent div
let getData = html => {
  var data = [];
  const $ = cheerio.load(html);
  $('div#getEvent > a.evcal_list_a').each((i, elem) => {
    data.push({
      link    : $(elem).attr('href'),
      title   : $(elem).find('span.evcal_event_title').text(),
      desc    : $(elem).find('span.evcal_desc_info').text(),
      day     : $(elem).find('em.evo_day').text(),
      month   : $(elem).find('span.start em').text(),
      date    : $(elem).find('em.evo_date span.end').text(),
      time    : $(elem).find('em.evcal_time').text(),
      venue   : $(elem).find('em.evcal_location:nth-child(odd)').text(),
      address : $(elem).find('em.evcal_location.event_location_name:nth-child(even)').text(),
      city    : $(elem).find('span.evcal_desc3').text(),
      phone   : $(elem).find('em.evcal_cmd').text()
    });
  });
  return data;
}


/*
EVENT SCHEMA

|_  link       // evcal_list_a[href]
|_  title     // span.evcal_event_title
|_  desc      // span.evcal_desc_info

|_  day     // em.evo_day
|_  month   // span.start em
|_  date    // span.end
|_  time    // em.evcal_time

|_  venue     // em.evcal_location
|_  address   // em.evcal_location.event_location_name
|_  city      // span.evcal_desc3
|_  phone     // span.evcal_desc3 em.evcal_cmd i


*/


//  https://blog.bitsrc.io/how-to-perform-web-scraping-using-node-js-part-2-7a365aeedb43

// https://www.reddit.com/r/learnprogramming/comments/3zbhcd/nodejs_using_cheerio_to_scrape_hrefs_but_part_of/

// https://codepen.io/PositionRelativ/pen/zVYNBX

