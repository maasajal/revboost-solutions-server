// Router
const express = require('express');
const router = express.Router();
import { getIncomeCollection,addIncomeEntry } from "../../controllers/incomeController/income.controller";

// GET Income Collection for a User
router.get('/:userId', getIncomeCollection);

// POST Add a New Income Entry
router.post('/:userId', addIncomeEntry);

