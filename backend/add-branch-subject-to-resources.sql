-- Add branch and subject columns to resources table
ALTER TABLE resources
ADD COLUMN IF NOT EXISTS branch VARCHAR(50) DEFAULT 'IT',
ADD COLUMN IF NOT EXISTS subject VARCHAR(100);

-- Optional: backfill branch/subject with NULLs or defaults
-- UPDATE resources SET branch = 'CSE' WHERE branch IS NULL; -- if desired

