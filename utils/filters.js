const Article = require('../models/article');

// Clip text
const clipText = (text, len) => {
    if (text.length > len) {
        return text.substr(0, len) + "..."
    } else {
        return text;
    }
};

// Get filtered data
const getArticles = async (filter) => {
  let articles = [];
  let result = null;
  try {
    result = await Article.find();
  } catch (e) {
    console.log(e);
  }

  if (result) {
    result.map((article) => {
      if (filter) {
        if (article.journal === filter) {
          articles.push({
            link: article.link,
            title: article.title,
            text: clipText(article.text, 450),
            journal: article.journal
          });
        }
      } else {
        articles.push({
          link: article.link,
          title: article.title,
          text: clipText(article.text, 450),
          journal: article.journal
        });
      }
    });
  }

  return articles;
};

module.exports = getArticles;
