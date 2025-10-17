const db = require("../../db/connection");

function convertTimestampToDate ({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};


function createLookupObj(articles) {
  const lookupObj = {};
  
  articles.forEach((article) => {
  const title = article.title
  const id = article.article_id

  lookupObj[title] = id
  
  })
  return lookupObj
}

module.exports = {createLookupObj, convertTimestampToDate};

    // {
    //       article_id: 4,
    //       title: 'Student SUES Mitch!',
    //       topic: 'mitch',
    //       author: 'rogersop',
    //       body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
    //       created_at: 2020-05-06T01:14:00.000Z,
    //       votes: 0,
    //       article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    //     },