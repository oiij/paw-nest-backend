CREATE TYPE "public"."adoption_status" AS ENUM('pending', 'reviewing', 'interview', 'approved', 'rejected', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."banner_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."chat_message_type" AS ENUM('text', 'image', 'emoji');--> statement-breakpoint
CREATE TYPE "public"."comment_status" AS ENUM('active', 'hidden', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."housing_type" AS ENUM('own', 'rent', 'shared');--> statement-breakpoint
CREATE TYPE "public"."link_type" AS ENUM('pet', 'post', 'url', 'page');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('system', 'adoption', 'comment', 'like', 'activity');--> statement-breakpoint
CREATE TYPE "public"."pet_gender" AS ENUM('male', 'female', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."pet_status" AS ENUM('pending', 'available', 'adopted', 'offline');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'hidden', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('dynamic', 'story', 'knowledge', 'rescue');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'rescuer', 'admin');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('cat', 'dog', 'other');--> statement-breakpoint
CREATE TYPE "public"."target_type" AS ENUM('pet', 'post');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'banned', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TABLE "adoptions" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"pet_id" varchar(21) NOT NULL,
	"status" "adoption_status" DEFAULT 'pending' NOT NULL,
	"applicant_name" varchar(50) NOT NULL,
	"applicant_age" integer NOT NULL,
	"phone" varchar(20) NOT NULL,
	"wechat" varchar(50),
	"city" varchar(50) NOT NULL,
	"housing_type" "housing_type" NOT NULL,
	"has_pet_exp" boolean DEFAULT false NOT NULL,
	"accept_sterilize" boolean DEFAULT true NOT NULL,
	"daily_care_time" integer,
	"family_agree" boolean DEFAULT true NOT NULL,
	"allergy" boolean DEFAULT false NOT NULL,
	"reason" text,
	"reviewer_id" varchar(21),
	"review_note" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"image" text NOT NULL,
	"link" text,
	"link_type" "link_type",
	"sort" integer DEFAULT 0 NOT NULL,
	"status" "banner_status" DEFAULT 'active' NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"room_id" varchar(21) NOT NULL,
	"sender_id" varchar(21) NOT NULL,
	"type" "chat_message_type" DEFAULT 'text' NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user1_id" varchar(21) NOT NULL,
	"user2_id" varchar(21) NOT NULL,
	"last_message" text,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"post_id" varchar(21) NOT NULL,
	"parent_id" varchar(21),
	"content" text NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"status" "comment_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"target_type" "target_type" NOT NULL,
	"target_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"sender_id" varchar(21) NOT NULL,
	"receiver_id" varchar(21) NOT NULL,
	"type" "message_type" NOT NULL,
	"title" varchar(200),
	"content" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_images" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"pet_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_tags" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"pet_id" varchar(21) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"species" "species" NOT NULL,
	"breed" varchar(50),
	"age" integer,
	"gender" "pet_gender" NOT NULL,
	"weight" real,
	"color" varchar(30),
	"city" varchar(50) NOT NULL,
	"district" varchar(50),
	"description" text,
	"health_status" varchar(100),
	"vaccinated" boolean DEFAULT false NOT NULL,
	"dewormed" boolean DEFAULT false NOT NULL,
	"sterilized" boolean DEFAULT false NOT NULL,
	"status" "pet_status" DEFAULT 'pending' NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"adopt_fee" integer,
	"publisher_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_images" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"type" varchar(10) DEFAULT 'image' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"post_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(30) NOT NULL,
	"post_id" varchar(21) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"title" varchar(200),
	"content" text NOT NULL,
	"type" "post_type" DEFAULT 'dynamic' NOT NULL,
	"location" varchar(100),
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"favorite_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"status" "post_status" DEFAULT 'published' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"reporter_id" varchar(21) NOT NULL,
	"target_type" "target_type" NOT NULL,
	"target_id" varchar(21) NOT NULL,
	"reason" text NOT NULL,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"handler_id" varchar(21),
	"handle_note" text,
	"handled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"open_id" varchar(64) NOT NULL,
	"union_id" varchar(64),
	"phone" varchar(20),
	"nickname" varchar(50) NOT NULL,
	"avatar" text,
	"gender" varchar(10) DEFAULT 'unknown',
	"city" varchar(50),
	"bio" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_open_id_unique" UNIQUE("open_id"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoptions" ADD CONSTRAINT "adoptions_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_user1_id_users_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_user2_id_users_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_tags" ADD CONSTRAINT "pet_tags_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_publisher_id_users_id_fk" FOREIGN KEY ("publisher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "adoptions_user_pet_idx" ON "adoptions" USING btree ("user_id","pet_id");--> statement-breakpoint
CREATE INDEX "adoptions_pet_status_idx" ON "adoptions" USING btree ("pet_id","status");--> statement-breakpoint
CREATE INDEX "banners_status_sort_idx" ON "banners" USING btree ("status","sort");--> statement-breakpoint
CREATE INDEX "chat_messages_room_created_idx" ON "chat_messages" USING btree ("room_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_rooms_users_idx" ON "chat_rooms" USING btree ("user1_id","user2_id");--> statement-breakpoint
CREATE INDEX "comments_post_created_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_target_idx" ON "favorites" USING btree ("user_id","target_type","target_id");--> statement-breakpoint
CREATE INDEX "favorites_user_idx" ON "favorites" USING btree ("user_id","target_type");--> statement-breakpoint
CREATE INDEX "messages_receiver_read_idx" ON "messages" USING btree ("receiver_id","is_read","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "pet_tags_name_pet_id_idx" ON "pet_tags" USING btree ("name","pet_id");--> statement-breakpoint
CREATE INDEX "pets_species_status_idx" ON "pets" USING btree ("species","status");--> statement-breakpoint
CREATE INDEX "pets_city_status_idx" ON "pets" USING btree ("city","status");--> statement-breakpoint
CREATE INDEX "pets_publisher_idx" ON "pets" USING btree ("publisher_id");--> statement-breakpoint
CREATE INDEX "post_tags_name_post_idx" ON "post_tags" USING btree ("name","post_id");--> statement-breakpoint
CREATE INDEX "posts_user_created_idx" ON "posts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "posts_type_status_idx" ON "posts" USING btree ("type","status");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reports_target_idx" ON "reports" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_city_idx" ON "users" USING btree ("city");