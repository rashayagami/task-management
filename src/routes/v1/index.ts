import { Router } from 'express';
import status from "http-status";


const router = Router();

router.get('/', (req, res) => {
    res.sendStatus(status.OK).send({
        result: "ok"
    })
});

export default router