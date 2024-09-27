/*
  Warnings:

  - You are about to alter the column `touristId` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `Int`.
  - The primary key for the `tourists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[nik]` on the table `tourists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `tourists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `tourist_to_booking_fk`;

-- AlterTable
ALTER TABLE `bookings` MODIFY `touristId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tourists` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `tourists_nik_key` ON `tourists`(`nik`);

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `tourist_to_booking_fk` FOREIGN KEY (`touristId`) REFERENCES `tourists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
