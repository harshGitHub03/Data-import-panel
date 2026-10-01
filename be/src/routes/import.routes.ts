import { Router } from 'express';
import { upload } from '../middleware/upload';
import { importRecords } from '../controllers/import.controller';

const router = Router();

router.post('/', upload.single('file'), importRecords);

export default router;
