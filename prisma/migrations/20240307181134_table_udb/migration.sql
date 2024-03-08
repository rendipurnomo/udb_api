/*
  Warnings:

  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to drop the column `productId` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `ProductId` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_productId_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_userId_fkey`;

-- AlterTable
ALTER TABLE `product` MODIFY `price` VARCHAR(191) NOT NULL,
    MODIFY `stock` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `productId`,
    DROP COLUMN `totalPrice`,
    DROP COLUMN `userId`,
    ADD COLUMN `ProductId` VARCHAR(191) NOT NULL,
    ADD COLUMN `pesananDiterima` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `total_price` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `roles` VARCHAR(191) NULL DEFAULT 'member',
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `access_token` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `banner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `img_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
