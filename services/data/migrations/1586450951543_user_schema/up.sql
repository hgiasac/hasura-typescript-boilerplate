
CREATE DOMAIN email AS TEXT
CHECK(
   VALUE ~ '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-]+([.][a-zA-Z0-9-]+)?$'
);

CREATE TABLE "public"."status"("id" text NOT NULL, "description" text NOT NULL, PRIMARY KEY ("id") );

INSERT INTO "public"."status" ("id", "description")
VALUES 
  ('active', 'Active'), 
  ('inactive', 'Inactive'),
  ('disabled', 'Disabled'), 
  ('deleted', 'Deleted');

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
  "email" email NOT NULL UNIQUE, 
  "password" text NOT NULL, 
  "first_name" text NOT NULL DEFAULT '', 
  "last_name" text NOT NULL DEFAULT '', 
  "role" text NOT NULL, 
  "created_at" timestamptz NOT NULL DEFAULT now(), 
  "updated_at" timestamptz NOT NULL DEFAULT now(), 
  "created_by" uuid, 
  "updated_by" uuid, 
  "status" text NOT NULL, 
  PRIMARY KEY ("id"), 
  FOREIGN KEY ("status") REFERENCES "public"."status"("id") 
    ON UPDATE restrict ON DELETE restrict, 
  CONSTRAINT "users_check_first_name" CHECK (char_length(first_name) <= 50), 
  CONSTRAINT "users_check_last_name" CHECK (char_length(last_name) <= 50)
);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_users_updated_at"
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_users_updated_at" ON "public"."users" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE VIEW public.me AS
    SELECT * FROM users;

CREATE VIEW public.roles AS
    select * from hdb_catalog.hdb_role;
