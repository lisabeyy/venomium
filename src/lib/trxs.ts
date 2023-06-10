import axios from "axios";
import {Kind, Token, Transaction} from "../types/transactions.type";


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

const accRequest = {
  "id": ""
}

const tokenBalanceReq = {
  "ownerAddress": "",
  "limit": 1000,
  "offset": 0,
  "ordering": "amountdescending"
}

export async function fetchAssets(accountAddress: string) {

  const accountVenom = await GetAccount(accountAddress);
  const balanceToken = await GetTokenBalance(accountAddress);

  const tokenBalances: Token[] = [];
  for (const tokenBalance of balanceToken.body ?. balances) {
    tokenBalances.push(tokenBalance);
  }

  const newBalance: Token = {
    amount: accountVenom.body.balance,
    blockTime: accountVenom.body.updatedAt,
    ownerAddress: accountVenom.body.address,
    rootAddress: '',
    token: 'Venom',
    tokenStandard: 'TIP3'
  };

  tokenBalances.push(newBalance);
  return tokenBalances.sort((a, b) => b.blockTime - a.blockTime);

}


export async function fetchTransactions(accountAddress: string) {


  const messages = await GetMessages(accountAddress);
  const trxs = await GetTokenTrx(accountAddress);

  const transactions: Transaction[] = [];

  for (const transaction of trxs.body ?. transactions) {
    transactions.push(transaction);
  }

  for (const transaction of messages.body) {
    const newTransaction: Transaction = {
      transactionHash: transaction.transactionHash,
      sender: {
        ownerAddress: transaction.srcAddress,
        tokenWalletAddress: null
      },
      receiver: {
        ownerAddress: transaction.dstAddress,
        tokenWalletAddress: null
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


  return transactions.sort((a, b) => b.blockTime - a.blockTime);

}


async function GetTokenTrx(accountAddress: string, apiPath = process.env.VENOM_TOKEN_API): Promise<any> {
  trxRequest.ownerAddress = accountAddress;
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>('https://testnet-tokens.venomscan.com/v1/transactions', trxRequest, {
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

async function GetAccount(accountAddress: string, apiPath = process.env.VENOMSCAN_API): Promise<any> {
  accRequest.id = accountAddress;
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>('https://testnet-api.venomscan.com/v1/accounts', accRequest, {
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


  async function GetTokenBalance(accountAddress: string, apiPath = process.env.VENOMSCAN_TOKEN_API): Promise<any>{
    
  tokenBalanceReq.ownerAddress = accountAddress;
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>('https://testnet-tokens.venomscan.com/v1/balances', tokenBalanceReq, {
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
  }}


async function GetMessages(accountAddress: string): Promise<any> {
  msgRequest.includeAccounts[0] = accountAddress;


  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>('https://testnet-api.venomscan.com/v1/messages/list', msgRequest, {
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
