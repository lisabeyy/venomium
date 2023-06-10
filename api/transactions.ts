/* eslint-disable import/no-anonymous-default-export */
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import {Kind, Transaction} from "@/app/types/transactions.type";
import { fetchTransactions } from "@/lib/trxs";





export default async function (req: NextApiRequest, res: NextApiResponse) {
  const accountAddress = req.body.accountAddress;

 //const transactions = await fetchTransactions(accountAddress);
  //res.json(transactions);

}
