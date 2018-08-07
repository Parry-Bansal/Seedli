-- Table for all the users
CREATE TABLE eq(
  id SERIAL PRIMARY KEY,
  understand VARCHAR(15),
  organized VARCHAR(15),
  fight VARCHAR(15),
  friendships VARCHAR(15),
  conflict VARCHAR(15)
);

CREATE TABLE matm(
  id SERIAL PRIMARY KEY,
  feel VARCHAR(15),
  sleep INT,
  sessions INT,
  beenupto VARCHAR(15),
  water INT,
  eatentoday VARCHAR(100)
);

INSERT INTO eq(understand,organized,fight,friendships,conflict)
VALUES
('sometimes','almost never','almost always','rarely','often'),
('often','sometimes','almost never','almost always','rarely'),
('almost never', 'almost always', 'rarely', 'often', 'sometimes'),
('almost always','rarely','often','sometimes','almost never');

INSERT INTO matm(feel, sleep, sessions, beenupto, water, eatentoday)
VALUES
('confident', 5, 1, 'family', 4, 'chips'),
('hopeful', 12, 2, 'friends', 5, 'eggs'),
('judged', 11, 3, 'movies', 8,'ice cream'),
('stressed', 10, 4, 'party', 10, 'samosa');
