const { Router } = require('express');
const getArticles = require('../utils/filters');

const router = Router();

/* GET home page */
router.get('/', async (req, res, next) => {
  res.render('index', {
    title: 'Tech news',
    information: 'Latest tech news',
    isHome: true,
    'articles': await getArticles()
  });
});

router.get('/insight', async (req, res, next) => {
  res.render('index', {
    title: 'Insight news',
    information: 'Insight tech news',
    isInsight: true,
    'articles': await getArticles('Insight')
  });
});

router.get('/theverge', async (req, res, next) => {
  res.render('index', {
    title: 'The Verge news',
    information: 'The Verge tech news',
    isVerge: true,
    'articles': await getArticles('The Verge')
  });
});

module.exports = router;
