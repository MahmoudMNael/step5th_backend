-- CreateTable
CREATE TABLE "RefferalMetaData" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "number_of_levels" INTEGER NOT NULL,
    "first_level_percentage" DOUBLE PRECISION NOT NULL,
    "mid_levels_percentage" DOUBLE PRECISION NOT NULL,
    "last_level_percentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefferalMetaData_pkey" PRIMARY KEY ("id")
);
