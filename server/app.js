const  express = require('express');
const  app = express();
const  cors = require('cors');
const bodyParser = require('body-parser');
const config = require('../server/db/db.js');
const pg = require('pg');
const format = require('pg-format');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new pg.Pool(config);

pool.connect(function(err) {
  if (err) {
    console.log(err);
  }
})

app.get('/reviews', function (req, res) {
  let productId = req.query.product_id;
  console.log('this is ', productId);
  let page = (req.query.page === undefined) ? 0 : req.query.page;
  let count = (req.query.count === undefined) ? 5 :  req.query.count;
  let totalOffset = page * count;

  let result = {};
  pool.query(`select id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos from review
  where product_id = ${productId} ORDER BY id ASC LIMIT ${count} OFFSET ${totalOffset};`, function(err, data) {
    if (err) {
      res.json({
        status: '404',
        msg: 'fail',
        data: err
      })
      console.log('error', err)
    } else {
      var date = new Date(parseInt(data.rows.date) * 1000)
      result['product'] = productId;
      result['page'] = page;
      result['count'] = count;
      result['results'] = data.rows;
      // console.log('this is result', result);
      res.json(result);
    }
  });
})


app.get('/reviews/meta', function (req, res) {
  let productId = req.query.product_id;

  pool.query(`select characteristic.characteristic_id, review.recommend, review.rating, characteristic.id, \
  characteristic.values, characteristic_value.name
  from review full outer join characteristic on characteristic.review_id = review.id \
  full outer join characteristic_value on characteristic_value.id = characteristic.characteristic_id \
  where review.product_id = ${productId} ORDER BY review.id ASC;`, function(err, data) {
    if (err) {
      // res.json({
      //   status: '404',
      //   msg: 'fail',
      //   data: err
      // })
      console.log('err', err)
    } else {
      let datas = data.rows;
      let ratings = {};
      let recommended = {};
      let characteristic = {};
      let result = {};
      console.log('resfsfs', datas)

      for (let i = 0; i < datas.length; i++) {

        if (ratings[datas[i].rating] === undefined) {
          ratings[datas[i].rating] = 0;
        }

        if (recommended[datas[i].recommend] === undefined) {
          recommended[datas[i].recommend] = 0;
        }

        if (characteristic[datas[i].name] === undefined) {
          characteristic[datas[i].name] = {id: datas[i].characteristic_id, value: datas[i].values};
        }

        ratings[datas[i].rating] ++;
        recommended[datas[i].recommend] ++;
        characteristic[datas[i].name].value += datas[i].values;
      }

      let length = datas.length / Object.keys(characteristic).length;

      for (let item in characteristic) {
        characteristic[item].value = characteristic[item].value / length;
      }
      result.product_id = productId;
      result.ratings = ratings;
      result.recommended = recommended;
      result.characteristics = characteristic;
      console.log('this is', result)
      res.json(result);
    }
  });

})

app.post('/reviews', (req, res) => {

  let product_id = req.body.product_id;
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
  // console.log('sfda', product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness, photos);
  pool.query('INSERT INTO review(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness, photos) \
  VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',[product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, helpfulness, photos], function(err, data) {
    if (err) {
      console.log(err)
    }
    console.log('this is ', data)
    let reviewsId = data.rows[0].id;
    // let reviewsId = 5774954;
    console.log('rereer', Object.entries(characteristics));
    let datas = Object.entries(characteristics);
    // pool.query(`SELECT * FROM characteristic_value WHERE product_id = ${product_id}`, (err, charData) => {
    // // pool.query(`SELECT * FROM characteristic_value INNER JOIN characteristic ON (characteristic_value.id = characteristic.characteristic_id) WHERE characteristic_value.product_id = ${product_id}`, (err, charData) => {
    //   if (err) {
    //     console.log(err)
    //   }
    //   // let datas = charData.rows;
    //   let datas = charData.rows;
    //   console.log('fdsa', datas);
      for (let i = 0; i < datas.length; i++) {
        datas[i][0] = parseInt(datas[i][0]);
        datas[i].push(reviewsId);
        // let charArr = [];
        // charArr.push(datas[i].id);
        // charArr.push(reviewsId);
        // charArr.push(characteristics[datas[i].id]);
        // charArr.push(datas[i].name);
        // result.push(charArr);
      }

      console.log('dfafsa', datas);
      pool.query(format('INSERT INTO characteristic(characteristic_id, values, review_id) VALUES %L', datas), (err, charData) => {
        if (err) {
          console.log(err)
        }
        console.log('successful')
      })
    });
  // });
})

app.put('/reviews/:review_id/helpful', (req, res) => {

  var reviewId = req.params.review_id;
  console.log('fdsafsa', reviewId)
  pool.query(`UPDATE review SET helpfulness = helpfulness + 1 WHERE id = ($1);`, [reviewId], (err, data) => {
    if (err) {
      console.log(err)
    }
    console.log('fdsaf');
  });

})

app.put('/reviews/:review_id/report', (req, res) => {

  var reviewId = req.params.review_id;
  pool.query(`UPDATE review SET reported = true WHERE id = ($1);`, [reviewId], (err) => {
    if (err) {
      console.log(err)
    }
  });

})

// router.get('/questions/:product_id', (req, res) => {

//   var productId = req.params.product_id;
//   var endpoint = `?product_id=${productId}`;
//   getProducts(endpoint)
//   .then(question=> {
//     question.data.results.push({'CloundinaryAPI': process.env.CLOUDINARY});
//     res.send(JSON.stringify(question.data.results));
//   })
//   .catch(err => {
//     res.end()
//   })

// })

module.exports = app;
