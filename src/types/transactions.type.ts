
export enum Kind {
  mint = "mint",
  burn = "burn",
  send = "send",
  sendcancellation = "sendcancellation",
  burncancellation = "burncancellation",
  receive = "receive"
}

export interface Transaction {
  transactionHash: string;
  sender: {
    ownerAddress: string;
    tokenWalletAddress: string | null;
  };
  receiver: {
    ownerAddress: string;
    tokenWalletAddress: string | null;
  };
  amount: string;
  rootAddress: string;
  token: string;
  kind: Kind;
  standard: string;
  blockTime: number;
  imageUrl?: string;
}



export interface Token {
  amount: string;
  blockTime: number;
  ownerAddress: string;
  rootAddress: string;
  token: string;
  tokenStandard: string;
}