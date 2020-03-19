DROP TABLE IF EXISTS scores;

CREATE TABLE scores(
    id int AUTO_INCREMENT NOT NULL,
    score int,
    name varchar (3),
    PRIMARY KEY(id)
);

INSERT INTO scores(id, score, name) VALUES(null, 10000, "ZAP");
INSERT INTO scores(id, score, name ) VALUES(null, 7500, "JOS");
INSERT INTO scores(id, score, name ) VALUES(null, 5000, "NIK");
