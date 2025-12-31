/*
  Warnings:

  - Made the column `purpose` on table `UsageLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UsageLog" ALTER COLUMN "endTime" DROP NOT NULL,
ALTER COLUMN "purpose" SET NOT NULL;
