import { Router } from 'express';
import { listRecords, getSummary, getRecord, updateRecord, deleteRecord } from '../controllers/records.controller';

const router = Router();

router.get('/summary', getSummary);
router.get('/', listRecords);
router.get('/:id', getRecord);
router.patch('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
