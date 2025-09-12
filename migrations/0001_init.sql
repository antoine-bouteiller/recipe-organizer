-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" INTEGER,
    "refresh_token_expires_at" INTEGER,
    "scope" TEXT,
    "password" TEXT,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "plural_name" TEXT
);

-- CreateTable
CREATE TABLE "recipe_ingredients_sections" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "recipe_id" INTEGER NOT NULL,
    "sub_recipe_id" INTEGER,
    "ratio" REAL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "recipe_ingredients_sections_sub_recipe_id_fkey" FOREIGN KEY ("sub_recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "recipe_ingredients_sections_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "recipes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "steps" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "section_ingredients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT,
    CONSTRAINT "section_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "section_ingredients_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "recipe_ingredients_sections" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expires_at" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" INTEGER NOT NULL,
    "image" TEXT,
    "created_at" INTEGER NOT NULL,
    "updated_at" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" INTEGER NOT NULL,
    "created_at" INTEGER,
    "updated_at" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_unique" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_unique" ON "user"("email");
