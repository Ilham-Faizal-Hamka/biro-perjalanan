/*
  Warnings:

  - You are about to alter the column `tripId` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `Int`.
  - The primary key for the `trips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `trips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(8)` to `Int`.
  - A unique constraint covering the columns `[code]` on the table `trips` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `trip_to_booking_fk`;

-- AlterTable
ALTER TABLE `bookings` MODIFY `tripId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `trips` DROP PRIMARY KEY,
    ADD COLUMN `code` VARCHAR(100) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `trips_code_key` ON `trips`(`code`);

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `trip_to_booking_fk` FOREIGN KEY (`tripId`) REFERENCES `trips`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
