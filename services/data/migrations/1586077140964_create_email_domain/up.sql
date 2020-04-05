CREATE DOMAIN email AS TEXT
CHECK(
   VALUE ~ '^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$'
);
