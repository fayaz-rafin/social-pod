CREATE TABLE "pet_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pet_name" varchar(100) DEFAULT 'Broccoli',
	"pet_type" varchar(50) DEFAULT 'broccoli',
	"hearts" integer DEFAULT 6 NOT NULL,
	"max_hearts" integer DEFAULT 6 NOT NULL,
	"level" integer DEFAULT 0,
	"experience" integer DEFAULT 0,
	"last_fed_at" timestamp,
	"last_watered_at" timestamp,
	"last_fertilized_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pet_table_user_id_unique" UNIQUE("user_id")
);
