\c reviews;

-- DROP table IF EXISTS characteristic;

CREATE TABLE IF NOT EXISTS characteristic(
  id SERIAL PRIMARY KEY NOT NULL,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  values SMALLINT NOT NULL,
  FOREIGN KEY (review_id) REFERENCES review(id)
  FOREIGN KEY (characteristic_id) REFERENCES characteristic_value(id)
);

-- \COPY characteristic(id, characteristic_id, review_id, values) FROM '/home/yytt77/HackReactor/reviews-API/server/csv/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
-- SELECT setval('review_id_seq', max(id)) from review;

CREATE TABLE IF NOT EXISTS characteristic_value(
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(20),
);

-- \COPY characteristic(id, product_id, name) FROM '/home/yytt77/HackReactor/reviews-API/server/csv/characteristics.csv' DELIMITER ',' CSV HEADER;
-- CREATE INDEX ON characteristic (id);