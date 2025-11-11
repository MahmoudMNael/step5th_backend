-- CreateTable
CREATE TABLE "CategoryNotificationsSubscriber" (
    "category_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CategoryNotificationsSubscriber_pkey" PRIMARY KEY ("category_id","user_id")
);

-- AddForeignKey
ALTER TABLE "CategoryNotificationsSubscriber" ADD CONSTRAINT "CategoryNotificationsSubscriber_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryNotificationsSubscriber" ADD CONSTRAINT "CategoryNotificationsSubscriber_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
