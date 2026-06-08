import { Router } from 'express';
import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  addCustomerDocument,
  deleteCustomerDocument
} from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

router.post('/:id/documents', addCustomerDocument);
router.delete('/documents/:docId', deleteCustomerDocument);

export default router;
