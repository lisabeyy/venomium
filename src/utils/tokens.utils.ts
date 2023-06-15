const tokens = [{
    symbol: 'Venom',
    decimals: 9,
    address: '0:2c3a2ff6443af741ce653ae4ef2c85c2d52a9df84944bbe14d702c3131da3f14'
  },];


// Utility function to get the decimals for a given token
export function getAmountWithDecimal(amount, tokenSymbol) {
  const token = tokens.find((t) => t.symbol === tokenSymbol);
  return token ? amount / (10 ** token.decimals) : amount;
}


// Utility function to get the address for a given token
export function getAddressForToken(tokenSymbol) {
  const token = tokens.find((t) => t.symbol === tokenSymbol);
  return token ? token.address : 1;
}

export function retrieveImage(tokenSymbol) {

  const venomTokens = ['VENOM', 'WVENOM', 'TSTVENOM'];
  const testTokens = ['TUSDT'];

if (tokenSymbol) {
  if (testTokens.includes(tokenSymbol)) {
    return `https://testnet.web3.world/token-icons/${
      tokenSymbol.substring(1)
    }.png`;
  } else if (venomTokens.includes(tokenSymbol.toUpperCase())){
    return 'https://testnet.web3.world/token-icons/VENOM.png'
  }else if (tokenSymbol == 'NUMI') {
    return 'https://cdn.venom.foundation/assets/testnet/icons/NUMI/logo.svg'
  }
  else {
    return `https://testnet.web3.world/token-icons/${
      tokenSymbol.toUpperCase()
    }.png`;
  }
}

}
