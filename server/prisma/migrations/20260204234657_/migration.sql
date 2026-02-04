/*
  Warnings:

  - A unique constraint covering the columns `[documentName,folderId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `File_documentName_key` ON `File`;

-- CreateIndex
CREATE UNIQUE INDEX `File_documentName_folderId_key` ON `File`(`documentName`, `folderId`);
