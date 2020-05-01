import { uuid } from 'uuidv4';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface AllTransactionsDTO {
  transactions: Transaction[];
  balace: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): AllTransactionsDTO | {} {
    if (!this.transactions.length) {
      return { message: "There isn't any transaction yet" };
    }

    const balance = this.getBalance();

    return {
      transactions: this.transactions,
      balance,
    };
  }

  public getBalance(): Balance {
    const reducer = (type: 'income' | 'outcome'): Transaction => {
      const filterTransactionByType = this.transactions.filter(
        transaction => transaction.type === type,
      );
      const balanceReduced = filterTransactionByType.length
        ? filterTransactionByType.reduce((accumulator, current) => ({
            value: accumulator.value + current.value,
            id: current.id,
            title: current.title,
            type: current.type,
          }))
        : {
            value: 0,
            id: '',
            title: '',
            type,
          };

      return balanceReduced;
    };

    const incomeReduced = reducer('income');
    const outcomeReduced = reducer('outcome');
    const totalReduced = incomeReduced.value - outcomeReduced.value;

    const balance = {
      income: incomeReduced.value,
      outcome: outcomeReduced.value,
      total: totalReduced,
    };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = {
      id: uuid(),
      title,
      value,
      type,
    };

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
