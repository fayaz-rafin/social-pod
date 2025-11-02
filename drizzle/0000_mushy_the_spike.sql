CREATE TABLE "grocery_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt" varchar(1000) NOT NULL,
	"groceries" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"budget" numeric(10, 2) NOT NULL,
	"goals" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "item_table" (
	"item_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "item_table_item_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"item_name" varchar(255) NOT NULL,
	"item_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_data" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_points" integer DEFAULT 0,
	"user_lists" jsonb DEFAULT '[]'::jsonb,
	"user_goals" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
