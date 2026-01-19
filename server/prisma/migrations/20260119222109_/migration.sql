-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_folderId_fkey`;

-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_parentId_fkey`;

-- DropIndex
DROP INDEX `File_folderId_fkey` ON `File`;

-- DropIndex
DROP INDEX `Folder_parentId_fkey` ON `Folder`;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
