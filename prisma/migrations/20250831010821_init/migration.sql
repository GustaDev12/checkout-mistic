-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionId" TEXT NOT NULL DEFAULT '',
    "external_id" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("cpf", "email", "external_id", "id", "name", "phone", "transactionId") SELECT "cpf", "email", "external_id", "id", "name", "phone", "transactionId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
