-- CREATE DATABASE IF NOT EXISTS reviews;

\c reviews;

CREATE TABLE IF NOT EXISTS characteristic_value(
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS review (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date VARCHAR NOT NULL,
  summary VARCHAR NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(30) NOT NULL,
  reviewer_email VARCHAR(50) NOT NULL,
  response VARCHAR DEFAULT NULL,
  helpfulness SMALLINT NOT NULL,
  photos jsonb default '[]'::jsonb,
  FOREIGN KEY (product_id) REFERENCES characteristic_value(product_id)
);


CREATE TABLE IF NOT EXISTS characteristic(
  id SERIAL PRIMARY KEY NOT NULL,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  values SMALLINT NOT NULL,
  FOREIGN KEY (review_id) REFERENCES review(id),
  FOREIGN KEY (characteristic_id) REFERENCES characteristic_value(id)
);

-- \COPY review (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/home/yytt77/HackReactor/reviews-API/server/csv/reviews.csv' DELIMITER ',' CSV HEADER;
-- SELECT setval('review_id_seq', max(id)) from review;
-- CREATE TABLE IF NOT EXISTS characteristic(
--   id SERIAL PRIMARY KEY NOT NULL,
--   characteristic_id INT NOT NULL,
--   review_id INT NOT NULL,
--   values SMALLINT NOT NULL,
--   name VARCHAR(20),
--   FOREIGN KEY (review_id) REFERENCES review(review_id)
-- );

-- \COPY characteristic(id, characteristic_id, review_id, values) FROM '/home/yytt77/HackReactor/reviews-API/server/csv/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- CREATE TABLE IF NOT EXISTS characteristic_value(
--   id SERIAL PRIMARY KEY NOT NULL,
--   product_id INT NOT NULL,
--   name VARCHAR(20)
-- );

-- CREATE TABLE IF NOT EXISTS test(
--   reviews_id SERIAL PRIMARY KEY NOT NULL,
--   characteristic_id INT NOT NULL,
--   review_id INT NOT NULL,
--   values SMALLINT NOT NULL,
--   name VARCHAR(20)
-- );

-- CREATE TABLE IF NOT EXISTS test2(
--   reviews_id SERIAL PRIMARY KEY NOT NULL,
--   characteristic_id INT NOT NULL,
--   review_id INT NOT NULL,
--   values SMALLINT NOT NULL,
--   name VARCHAR(20)
-- );


-- CREATE INDEX ON review (review_id);

-- CREATE INDEX ON characteristic (id);
