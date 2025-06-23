-- Create sessions table for Replit Auth
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar PRIMARY KEY NOT NULL,
  "sess" jsonb NOT NULL,
  "expire" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY NOT NULL,
  "email" varchar UNIQUE,
  "first_name" varchar,
  "last_name" varchar,
  "profile_image_url" varchar,
  "role" varchar DEFAULT 'student' NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS "assignments" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "subject" varchar NOT NULL,
  "due_date" timestamp NOT NULL,
  "max_marks" integer NOT NULL,
  "submission_type" varchar NOT NULL,
  "allow_late_submission" boolean DEFAULT false,
  "teacher_id" varchar NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  FOREIGN KEY ("teacher_id") REFERENCES "users"("id")
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS "submissions" (
  "id" serial PRIMARY KEY NOT NULL,
  "assignment_id" integer NOT NULL,
  "student_id" varchar NOT NULL,
  "submission_text" text,
  "file_paths" jsonb DEFAULT '[]',
  "comments" text,
  "submitted_at" timestamp DEFAULT now(),
  "grade" integer,
  "feedback" text,
  "graded_at" timestamp,
  FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id"),
  FOREIGN KEY ("student_id") REFERENCES "users"("id")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_assignments_teacher_id" ON "assignments" ("teacher_id");
CREATE INDEX IF NOT EXISTS "idx_assignments_due_date" ON "assignments" ("due_date");
CREATE INDEX IF NOT EXISTS "idx_submissions_assignment_id" ON "submissions" ("assignment_id");
CREATE INDEX IF NOT EXISTS "idx_submissions_student_id" ON "submissions" ("student_id");
CREATE INDEX IF NOT EXISTS "idx_submissions_submitted_at" ON "submissions" ("submitted_at");
