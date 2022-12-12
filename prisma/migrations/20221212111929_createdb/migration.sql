-- CreateTable
CREATE TABLE "author" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "author_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date_of_publication" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "post_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_fk" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_category_fk" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
