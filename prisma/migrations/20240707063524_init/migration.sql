-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "organisation" (
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "organisation_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "_organisation_user" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_user_id_key" ON "user"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organisation_orgId_key" ON "organisation"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "_organisation_user_AB_unique" ON "_organisation_user"("A", "B");

-- CreateIndex
CREATE INDEX "_organisation_user_B_index" ON "_organisation_user"("B");

-- AddForeignKey
ALTER TABLE "_organisation_user" ADD CONSTRAINT "_organisation_user_A_fkey" FOREIGN KEY ("A") REFERENCES "organisation"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_organisation_user" ADD CONSTRAINT "_organisation_user_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
