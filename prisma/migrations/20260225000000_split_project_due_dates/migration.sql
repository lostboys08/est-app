-- AlterTable: rename dueDate to bidDueDate and add rfqDueDate
ALTER TABLE "Project" RENAME COLUMN "dueDate" TO "bidDueDate";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "rfqDueDate" DATETIME;
