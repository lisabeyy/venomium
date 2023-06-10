/* eslint-disable import/no-anonymous-default-export */
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import { Kind, Transaction } from "@/app/types/transactions.type";



const msgRequest = {
  "messageTypes": ["Internal"],
  "includeAccounts": [""],
  "limit": 100,
  "offset": 0,
  "ordering": {
    "column": "transactionTime",
    "direction": "DESC"
  }
}

const trxRequest = {
  "limit": 100,
  "offset": 0,
  "ordering": "blocktimeatdescending",
  "ownerAddress": "",
  "kind": [
    "mint",
    "burn",
    "send",
    "sendcancellation",
    "burncancellation",
    "receive"
  ]
}



export default async function (req: NextApiRequest, res: NextApiResponse) {


  const messages = await GetMessages(req, res);
  const trxs = await GetTokenTrx(req, res);

  const transactions: Transaction[] = [];

  for (const transaction of trxs.body.transactions) {
    transactions.push(transaction);
  }

  for (const transaction of messages.body) {
    const newTransaction: Transaction = {
      transactionHash: transaction.transactionHash,
      sender: {
        ownerAddress: transaction.srcAddress,
        tokenWalletAddress: null,
      },
      receiver: {
        ownerAddress: transaction.dstAddress,
        tokenWalletAddress: null,
      },
      amount: transaction.messageValue,
      rootAddress: "",
      token: "Venom",
      kind: transaction.isOut ? Kind.send : Kind.receive,
      standard: "Tip3",
      blockTime: transaction.transactionTime * 1000,
      imageUrl: 'https://testnet.web3.world/token-icons/VENOM.png'
    };

    transactions.push(newTransaction);
  }


  transactions.sort((a, b) => b.blockTime - a.blockTime); 
  res.json(transactions);

}




async function GetTokenTrx(req: NextApiRequest, res: NextApiResponse): Promise<any>  {
  trxRequest.ownerAddress = req.body.accountAddress;
  try {
    // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.VENOMSCAN_TOKEN_API + '/transactions', trxRequest, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },);

    return {status: 200, body: responseObj.data};

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      // 👇️ error: AxiosError<any, any>
      return {status: 400, body: error.message};
    } else {
      console.log('unexpected error: ', error);
      return {status: 400, body: 'An unexpected error occurred'};
    }
  }

}


async function GetMessages(req: NextApiRequest, res: NextApiResponse): Promise<any>  {
  msgRequest.includeAccounts[0] = req.body.accountAddress;

  try {
    console.log('try');
    // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.VENOMSCAN_API + '/messages/list', msgRequest, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    },);


    return {status: 200, body: responseObj.data};

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      // 👇️ error: AxiosError<any, any>
      return {status: 400, body: error.message};
    } else {
      console.log('unexpected error: ', error);
      return {status: 400, body: 'An unexpected error occurred'};
    }
  }
}
