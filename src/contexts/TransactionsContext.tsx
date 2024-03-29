import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface TransactionsProviderProps {
  children: ReactNode
}

interface CreateTransactionInput {
  description: string
  category: string
  price: number
  type: 'income' | 'outcome'
}


export interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransactions: (data: CreateTransactionInput) => Promise<void>
}


export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({children}: TransactionsProviderProps) {
  const [ transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (
    query?: string) => {
      const response = await api.get('/transactions', {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
          q: query
        }
      })

      setTransactions(response.data)
    
    }, []
  )

  const createTransactions = useCallback(
    async (data: CreateTransactionInput) => {
      const { category, description, price, type } = data

      const response = await api.post('/transactions', {
        category,
        description,
        price,
        type,
        createdAt: new Date(),
      })

      setTransactions(state => [response.data, ...state], )
    }, []
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions, createTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}