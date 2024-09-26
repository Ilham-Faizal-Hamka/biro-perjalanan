/*
  Warnings:

  - The primary key for the `tourists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tourists` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `tourist_to_booking_fk`;

-- AlterTable
ALTER TABLE `tourists` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`nik`);

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `tourist_to_booking_fk` FOREIGN KEY (`touristId`) REFERENCES `tourists`(`nik`) ON DELETE RESTRICT ON UPDATE CASCADE;
