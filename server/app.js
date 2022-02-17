const  express = require('express');
const  app = express();
const  cors = require('cors');
const bodyParser = require('body-parser');
const models = require('../server/models/index')


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/reviews', async function (req, res) {

  try {
    const productId = req.query.product_id;
    console.log('this is ', productId);
    let page = (req.query.page === undefined) ? 0 : req.query.page;
    let count = (req.query.count === undefined) ? 5 :  req.query.count;
    let totalOffset = page * count;
    models.reviews.get(productId, page, count, totalOffset, (err, data) => {
      if (err) {
        res.status(404).send(err.message);
      } else {
        res.json(data);
      }
    })
  } catch (err) {
      res.status(400).send(err.message);
  }

})


app.get('/reviews/meta', async function (req, res) {

  try {
    const productId = req.query.product_id;
    models.meta.get(productId, (err, data) => {
      if (err) {
        res.status(404).send(err.message);
      } else {
        res.json(data);
      }
    })
  } catch (err) {
    res.status(400).send(err.message);
  }

})

app.post('/reviews', async function (req, res) {

  try {
    const product_id = req.body.product_id;
    let rating = req.body.rating;
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var date = (new Date(Date.now() - tzoffset)).toISOString();
    let summary = req.body.summary;
    let body = req.body.body;
    let recommend = req.body.recommend;
    let reported = false;
    let reviewer_name = req.body.name;
    let reviewer_email = req.body.email;
    let helpfulness = 0;
    let photos = JSON.stringify(req.body.photos);
    let characteristics = req.body.characteristics;
    let result = [];
    models.reviews.post(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness, photos, characteristics,
      (err, data) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.sendStatus(201);
        }
    })
  } catch (err) {
    res.status(400).send(err.message);
  }

})

app.put('/reviews/:review_id/helpful', async function (req, res) {

  try {
    const reviewId = req.params.review_id;
    models.helpful.put(reviewId, (err, data) => {
        if (err) {
          res.status(404).send(err.message);
        } else {
          res.sendStatus(201);
        }
    })
  } catch (err) {
    res.status(400).send(err.message);
  }

})

app.put('/reviews/:review_id/report', async function (req, res) {

  try {
    const reviewId = req.params.review_id;
    models.report.put(reviewId, (err, data) => {
      if (err) {
        res.status(404).send(err.message);;
      } else {
        res.sendStatus(201);
      }
    })
  } catch (err) {
    res.status(400).send(err.message);
  }

})

module.exports = app;
