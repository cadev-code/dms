/*
  Warnings:

  - A unique constraint covering the columns `[folderName,parentId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Folder_folderName_key` ON `Folder`;

-- CreateIndex
CREATE UNIQUE INDEX `Folder_folderName_parentId_key` ON `Folder`(`folderName`, `parentId`);
