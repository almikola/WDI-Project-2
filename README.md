![ga](https://cloud.githubusercontent.com/assets/20629455/23824362/2c9817c2-066d-11e7-8988-7b1eefc6d628.jpg)![wdi](https://cloud.githubusercontent.com/assets/20629455/23824363/2ddeaa7e-066d-11e7-8630-f7c890c9f1c1.png)___<br>#Project 2 | Picasso-To-Go##OverviewFor the second project at GA, we were tasked with creating an app using a web API merged with the GoogleMaps JavaScript API to create a map-based Single Page Application. Having a strong interest in art and art history, I decided to map out the largest art robberies in history.See the app in action [here](https://picasso-to-go.herokuapp.com/).##The Build
* Back-end: Express/Node* Database: MongoDB* Front-end: JavaScript, jQuery* CSS framework: Bootstrap* External API: GoogleMaps##The Process
Having decided on the idea of creating a map around the greatest art thefts in history, I set about researching on whether such an API was available. Alas, the only art API that came close to being useful was owned and operated by Interpol, and I quickly realised I would have to build my own API to make this app come to life.

Luckily, I found an article online that listed the [50 Greatest Art Heists of All Time] (http://uk.complex.com/style/2013/06/the-biggest-art-heists-of-all-time) in a carousel format, which meant that each slide in the carousel was formatted similarly. After analysing the data presented, I designed and built a database to store the information I would receive after scraping the site. Scraping the website was fun as it was one big puzzle to solve. Using cheerio, I wrote a function that pulled down the content from the body tags on the website. Then, I stored each piece of information into a variable, which I then pushed into the database. In this way, I created my own data source.

Following this, I used the Google GeoCoder to retreieve the latitude and longitude of each location, which was then passed into the GoogleMaps API to plot onto the map. The next step was to create the modals that would pop up with relevant information about every heist, which is a built in function in GoogleMaps. After styling the app, my MVP was complete.

I then decided to add a search function to the website for usability and to make it more interactive. First, I wrote a function to store the values input into the search field. Then, I used a callback function to check that stored value against the values in the database. If they matched, the app would display that marker on the map. After building the authentication mechanism and styling the app, Picasso-To-Go was complete.

##The App
###Homepage

<img width="1275" alt="ptg-homepage" src="https://cloud.githubusercontent.com/assets/22897108/23889221/ce1e9720-0883-11e7-8563-de21de10fee8.png">

###Map

<img width="1275" alt="ptg-mapview" src="https://cloud.githubusercontent.com/assets/22897108/23889220/ce1b7f68-0883-11e7-91a7-e0fe40dc561c.png">

###Marker information

<img width="1275" alt="ptg-art" src="https://cloud.githubusercontent.com/assets/22897108/23889219/ce11fa7e-0883-11e7-8698-764a339b39b8.png">

###Search in action

<img width="1275" alt="ptg-search" src="https://cloud.githubusercontent.com/assets/22897108/23889218/cdfe114e-0883-11e7-9340-83075f42afb7.png">##Key Challenges / Learnings- The biggest challenge for this app was when I realised the website I wanted to scrape used lazy loading JavaScript. This meant that, although it looked like all the information was present on one page, in fact the page was still loading more information as the user scrolled down. For my scraping to work, the function had to include a mechanism that mimicked a user scrolling to access all the information. This was accomplished by continuing to load the next url until the story url changed.

- Another challenge was that for the search function to work correctly, the characters needed to match exactly, including capitalisation. This was fixed by including the toUpperCase method before the search term was compared with the database.##Future work

- Perhaps the easiest thing to make this app more functional is to create my own API with this, and more, information
- To include more images of the stolen paintings
- To expand the search function to include years