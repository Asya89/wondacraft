-- AlterTable
ALTER TABLE "Product" ADD COLUMN "makerId" TEXT;

-- CreateIndex
CREATE INDEX "Product_makerId_idx" ON "Product"("makerId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_makerId_fkey" FOREIGN KEY ("makerId") REFERENCES "Maker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
