import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transactions.findMany();
    if(transactions.length === 0) {
      return res.status(404).json({message: 'No transactions found'});
    }
    res.status(200).json(transactions);
  }catch(err) {
    res.status(500).json({message: 'Something went wrong', error: err.message});
  }
}

export const getTransactionById = async (req, res) => {
  try {
    const {id} = req.params;
    const transaction = await prisma.transactions.findUnique({where: {id}});
    if(!transaction) {
      return res.status(404).json({message: 'Transaction not found'});
    }
    res.status(200).json(transaction);
  }catch(err) {
    res.status(500).json({message: 'Something went wrong', error: err.message});
  }
}

export const createTransaction = async (req, res) => {
  try {
    const transaction = await prisma.transactions.create({
      data: req.body
    })
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({message: 'Something went wrong', error: error.message});
  }
}

export const updateTransaction = async (req, res) => {
  const transaction = await prisma.transactions.findFirst({
    where: {
      id: req.params.id
    }
  })

  if (!transaction) {
    return res.status(404).json({ msg: 'Transaction not found.' });
  }

  try {
    const updatedTransaction = await prisma.transactions.update({
      where: {
        id: transaction.id
      },
      data: req.body
    })
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({message: 'Something went wrong', error: error.message});
  }
}

export const deleteTransaction = async (req, res) => {
  const transaction = await prisma.transactions.findFirst({
    where: {
      id: req.params.id
    }
  })

  if (!transaction) {
    return res.status(404).json({ msg: 'Transaction not found.' });
  }

  try {
    const deletedTransaction = await prisma.transactions.delete({
      where: {
        id: transaction.id
      }
    })
    res.status(200).json(deletedTransaction);
  } catch (error) {
    res.status(500).json({message: 'Something went wrong', error: error.message});
  }
}