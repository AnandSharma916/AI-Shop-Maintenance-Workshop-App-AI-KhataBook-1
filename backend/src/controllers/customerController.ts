import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        JobCards: true,
        Udhari: true,
        Documents: true,
      },
    });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    const customer = await prisma.customer.create({
      data: { name, phone, address },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, phone, address } = req.body;
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, phone, address },
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.udhari.deleteMany({ where: { customerId: id } });
    
    const jobCards = await prisma.jobCard.findMany({ where: { customerId: id } });
    const jobCardIds = jobCards.map(jc => jc.id);
    await prisma.partUsed.deleteMany({ where: { jobCardId: { in: jobCardIds } } });
    await prisma.jobCard.deleteMany({ where: { customerId: id } });
    await prisma.customerDocument.deleteMany({ where: { customerId: id } });

    await prisma.customer.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

export const addCustomerDocument = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, photoUrl } = req.body;
    const doc = await prisma.customerDocument.create({
      data: {
        customerId: id,
        title,
        photoUrl
      }
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add document' });
  }
};

export const deleteCustomerDocument = async (req: Request, res: Response) => {
  try {
    const docId = req.params.docId as string;
    await prisma.customerDocument.delete({
      where: { id: docId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
};
