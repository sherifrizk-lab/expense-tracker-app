
export interface Expense {
    id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
}

export interface Notification {
    message: string;
    type: 'success' | 'error';
}
