-- Add search_vector column for full-text search
ALTER TABLE "Property" ADD COLUMN "search_vector" tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX "Property_search_vector_idx" ON "Property" USING GIN ("search_vector");

-- Create trigger function to auto-update search_vector
CREATE OR REPLACE FUNCTION property_search_vector_update() RETURNS trigger AS $$
DECLARE
  addr_text text := '';
BEGIN
  -- Extract text fields from the JSON address column
  IF NEW.address IS NOT NULL THEN
    addr_text := COALESCE(NEW.address->>'street', '') || ' ' ||
                 COALESCE(NEW.address->>'city', '') || ' ' ||
                 COALESCE(NEW.address->>'state', '') || ' ' ||
                 COALESCE(NEW.address->>'zipCode', '');
  END IF;

  NEW.search_vector :=
    setweight(to_tsvector('pg_catalog.english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('pg_catalog.english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('pg_catalog.english', addr_text), 'A') ||
    setweight(to_tsvector('pg_catalog.english', COALESCE(NEW."propertyType"::text, '')), 'C') ||
    setweight(to_tsvector('pg_catalog.english', COALESCE(array_to_string(NEW.amenities, ' '), '')), 'C');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on Property table
CREATE TRIGGER property_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Property"
  FOR EACH ROW
  EXECUTE FUNCTION property_search_vector_update();

-- Backfill existing rows
UPDATE "Property" SET "search_vector" =
  setweight(to_tsvector('pg_catalog.english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('pg_catalog.english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('pg_catalog.english',
    COALESCE(address->>'street', '') || ' ' ||
    COALESCE(address->>'city', '') || ' ' ||
    COALESCE(address->>'state', '') || ' ' ||
    COALESCE(address->>'zipCode', '')
  ), 'A') ||
  setweight(to_tsvector('pg_catalog.english', COALESCE("propertyType"::text, '')), 'C') ||
  setweight(to_tsvector('pg_catalog.english', COALESCE(array_to_string(amenities, ' '), '')), 'C');
