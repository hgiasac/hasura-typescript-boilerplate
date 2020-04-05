CREATE TABLE "public"."status"("id" text NOT NULL, "description" text NOT NULL, PRIMARY KEY ("id") );

INSERT INTO "public"."status" ("id", "description")
VALUES 
  ('active', 'Active'), 
  ('inactive', 'Inactive'),
  ('disabled', 'Disabled'), 
  ('deleted', 'Deleted');
