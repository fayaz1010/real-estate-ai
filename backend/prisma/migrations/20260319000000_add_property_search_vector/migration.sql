-- Add search_vector column for full-text search
ALTER TABLE "Property" ADD COLUMN "search_vector" tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX "Property_search_vector_idx" ON "Property" USING GIN ("search_vector");

-- Trigger function: builds tsvector from title, description, amenities, and address
CREATE OR REPLACE FUNCTION property_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.amenities, ' '), '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.address::json->>'street', '') || ' ' ||
                                     coalesce(NEW.address::json->>'city', '') || ' ' ||
                                     coalesce(NEW.address::json->>'state', '') || ' ' ||
                                     coalesce(NEW.address::json->>'zip', '') || ' ' ||
                                     coalesce(NEW.address::json->>'country', '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on INSERT or UPDATE of relevant fields
CREATE TRIGGER property_search_vector_trigger
  BEFORE INSERT OR UPDATE OF title, description, amenities, address
  ON "Property"
  FOR EACH ROW
  EXECUTE FUNCTION property_search_vector_update();

-- Backfill existing rows
UPDATE "Property" SET
  search_vector =
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(amenities, ' '), '')), 'C') ||
    setweight(to_tsvector('english', coalesce(address::json->>'street', '') || ' ' ||
                                     coalesce(address::json->>'city', '') || ' ' ||
                                     coalesce(address::json->>'state', '') || ' ' ||
                                     coalesce(address::json->>'zip', '') || ' ' ||
                                     coalesce(address::json->>'country', '')), 'C');
