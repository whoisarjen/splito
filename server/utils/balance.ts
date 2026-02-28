import { convertCurrency } from './currency'

interface ExpenseWithShares {
  id: string
  payerId: string
  amount: number
  currency: string
  shares: { userId: string; amount: number }[]
}

interface SettlementRecord {
  payerId: string
  receiverId: string
  amount: number
  currency: string
}

export interface BalanceResult {
  userId: string
  balance: number // positive = owed to them, negative = they owe
}

export interface SettlementSuggestion {
  fromUserId: string
  toUserId: string
  amount: number
}

/**
 * Calculate balances for all members in a group
 * Positive balance = others owe you money
 * Negative balance = you owe others money
 */
export function calculateBalances(
  expenses: ExpenseWithShares[],
  settlements: SettlementRecord[],
  settlementCurrency: string,
  rates: Record<string, number>
): BalanceResult[] {
  const balances: Record<string, number> = {}

  // Process expenses
  for (const expense of expenses) {
    const amountInSettlementCurrency = convertCurrency(
      expense.amount,
      expense.currency,
      settlementCurrency,
      rates
    )

    // Payer paid the full amount (they are owed this)
    balances[expense.payerId] = (balances[expense.payerId] || 0) + amountInSettlementCurrency

    // Each share recipient owes their portion
    for (const share of expense.shares) {
      const shareInSettlementCurrency = convertCurrency(
        share.amount,
        expense.currency,
        settlementCurrency,
        rates
      )
      balances[share.userId] = (balances[share.userId] || 0) - shareInSettlementCurrency
    }
  }

  // Process settlements
  for (const settlement of settlements) {
    const amountInSettlementCurrency = convertCurrency(
      settlement.amount,
      settlement.currency,
      settlementCurrency,
      rates
    )

    // Payer's debt decreases (balance goes up)
    balances[settlement.payerId] = (balances[settlement.payerId] || 0) + amountInSettlementCurrency
    // Receiver's credit decreases (balance goes down)
    balances[settlement.receiverId] =
      (balances[settlement.receiverId] || 0) - amountInSettlementCurrency
  }

  return Object.entries(balances).map(([userId, balance]) => ({
    userId,
    balance: Number(balance.toFixed(2)),
  }))
}

/**
 * Calculate optimal settlements to minimize transactions
 * Uses a greedy algorithm to match debtors with creditors
 */
export function calculateOptimalSettlements(
  balances: BalanceResult[]
): SettlementSuggestion[] {
  const settlements: SettlementSuggestion[] = []

  // Separate into debtors (negative balance) and creditors (positive balance)
  const debtors = balances
    .filter((b) => b.balance < -0.01) // threshold for floating point
    .map((b) => ({ ...b, remaining: Math.abs(b.balance) }))
    .sort((a, b) => b.remaining - a.remaining) // largest first

  const creditors = balances
    .filter((b) => b.balance > 0.01)
    .map((b) => ({ ...b, remaining: b.balance }))
    .sort((a, b) => b.remaining - a.remaining) // largest first

  // Greedy matching - match largest debtor with largest creditor
  for (const debtor of debtors) {
    while (debtor.remaining > 0.01) {
      const creditor = creditors.find((c) => c.remaining > 0.01)
      if (!creditor) break

      const amount = Math.min(debtor.remaining, creditor.remaining)
      settlements.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount: Number(amount.toFixed(2)),
      })

      debtor.remaining -= amount
      creditor.remaining -= amount
    }
  }

  return settlements
}

/**
 * Get individual balance between two users
 */
export function getBalanceBetweenUsers(
  expenses: ExpenseWithShares[],
  settlements: SettlementRecord[],
  userId1: string,
  userId2: string,
  currency: string,
  rates: Record<string, number>
): number {
  let balance = 0 // positive = userId1 is owed by userId2

  for (const expense of expenses) {
    const convertedAmount = convertCurrency(expense.amount, expense.currency, currency, rates)

    if (expense.payerId === userId1) {
      // userId1 paid - check if userId2 owes them
      const share = expense.shares.find((s) => s.userId === userId2)
      if (share) {
        const shareConverted = convertCurrency(share.amount, expense.currency, currency, rates)
        balance += shareConverted
      }
    } else if (expense.payerId === userId2) {
      // userId2 paid - check if userId1 owes them
      const share = expense.shares.find((s) => s.userId === userId1)
      if (share) {
        const shareConverted = convertCurrency(share.amount, expense.currency, currency, rates)
        balance -= shareConverted
      }
    }
  }

  for (const settlement of settlements) {
    const convertedAmount = convertCurrency(settlement.amount, settlement.currency, currency, rates)

    if (settlement.payerId === userId1 && settlement.receiverId === userId2) {
      balance -= convertedAmount
    } else if (settlement.payerId === userId2 && settlement.receiverId === userId1) {
      balance += convertedAmount
    }
  }

  return Number(balance.toFixed(2))
}
