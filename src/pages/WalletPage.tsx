import { useEffect } from 'react'
import Stats from '../components/stats';
import { useParams,useNavigate } from 'react-router-dom';




interface WalletProps {
  address: string;
  userAddress?: string;
}



export default function Wallet({ address, userAddress }: WalletProps) {



  const params = useParams();

  if(params && params.address) {
    address = params.address;
  }

  return (
    <main className="py-10 bg-white h-full overflow-y-scroll">
    <div className="px-4 sm:px-6 lg:px-8">

      <Stats address={address} userAddress={userAddress} />
    </div>
  </main>
  )
}
