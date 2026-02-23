// =============================
// ENUMS
// =============================

export type ExpenseCategory =
    | "MESS"
    | "MAINTENANCE"
    | "REPAIR"
    | "UTILITIES"
    | "SALARY"
    | "PURCHASE"
    | "RENT"
    | "OTHER";

export type PaymentMethod =
    | "CASH"
    | "UPI"
    | "BANK_TRANSFER"
    | "CARD"
    | "CHEQUE"
    | "OTHER";

export type ExpenseStatus =
    | "PAID"
    | "PENDING"
    | "FAILED"
    | "CANCELLED";


// =============================
// USER
// =============================

export interface ExpenseUser {
    id: string;
    name: string;
}


// =============================
// MAIN EXPENSE TYPE
// =============================

export interface Expense {
    id: string;

    title: string;
    description?: string;

    category: ExpenseCategory;

    amount: number;

    paymentMethod: PaymentMethod;

    paymentDate: string;

    status: ExpenseStatus;

    billUrl?: string;

    referenceId?: string | null;

    createdAt: string;
    updatedAt: string;

    createdBy?: ExpenseUser;
}