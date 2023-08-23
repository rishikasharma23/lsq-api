const express= require('express');
const leadHandler=require('../handlers/leadHandler');

const router=express.Router();

router.get('/',leadHandler.getAllLeads);
router.post('/',leadHandler.addLead);
router.get('/:id',leadHandler.getLeadById);
router.put('/:id',leadHandler.updateLeadsById);
router.delete('/:id',leadHandler.deleteLeadById);

module.exports=router;



