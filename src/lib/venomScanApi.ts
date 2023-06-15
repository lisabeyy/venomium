import axios from "axios";
import {Kind, Token, Transaction} from "../types/transactions.type";


const msgRequest = {
  "messageTypes": ["Internal"],
  "includeAccounts": [""],
  "limit": 200,
  "offset": 0,
  "ordering": {
    "column": "transactionTime",
    "direction": "DESC"
  }
}

const trxRequest = {
  "limit": 200,
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


export async function searchAccount(searchString: string) {

  const req = {
    query: searchString
  }
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.REACT_APP_VENOMSCAN_API + '/v1/search', req, {
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

export async function fetchAssets(accountAddress: string) {

  const req = {
    address: accountAddress,
    networkId: 'venom'
  }
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.REACT_APP_SNIPA_API + '/wallet-assets', req, {
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


export async function fetchTransactions(accountAddress: string) {


  const messages = await GetMessages(accountAddress);
  const trxs = await GetTokenTrx(accountAddress);

  const transactions: Transaction[] = [];

  if (trxs.body && trxs.body.transactions.length > 0) {

    for (const transaction of trxs.body ?. transactions) {
      transactions.push(transaction);
    }
  }
 
  if (messages.status == 200) {
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
  }


  if (transactions.length > 0) {
    return transactions.sort((a, b) => b.blockTime - a.blockTime);
  } else {
    return [];
  }

}


async function GetTokenTrx(accountAddress: string): Promise<any> {
  trxRequest.ownerAddress = accountAddress;
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.REACT_APP_VENOMSCAN_TOKEN_API + '/v1/transactions', trxRequest, {
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

async function GetAccount(accountAddress: string): Promise<any> {
  accRequest.id = accountAddress;
  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.REACT_APP_VENOMSCAN_API + '/v1/accounts', accRequest, {
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


async function GetTokenBalance(accountAddress: string): Promise<any> {

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
  }
}


async function GetMessages(accountAddress: string): Promise<any> {
  msgRequest.includeAccounts[0] = accountAddress;


  try { // 👇️ const data: CreateUserResponse
    const responseObj = await axios.post<any>(process.env.REACT_APP_VENOMSCAN_API + '/v1/messages/list', msgRequest, {
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
