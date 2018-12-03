--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE Events (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT    NOT NULL,
  desc TEXT    NOT NULL,
  expires TEXT  NOT NULL
);

CREATE INDEX Events_ix_title ON Events (title);

INSERT INTO Events (id, title, desc, expires) VALUES (1, 'Test','PARTY!', '31.12.2018');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP INDEX Events_ix_title;
DROP TABLE Events;