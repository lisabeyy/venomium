const events = [
  {
    type: 'Receive',
    timestamp: 1589030940000,
    amount: '+343.43 Venom',
    imageUrl:
      'https://testnet.web3.world/token-icons/VENOM.png',
  },
  {
    type: 'Sent',
    timestamp: 1592094540000,
    amount: '+0.45 Venom',
    imageUrl:
    'https://testnet.web3.world/token-icons/VENOM.png',
},
{
  type: 'Sent',
  timestamp: 1593094540000,
  amount: '+32.5 USDT',
  imageUrl:
  'https://testnet.web3.world/token-icons/USDT.png',
},

{
  type: 'Received',
  timestamp: 1594094540000,
  amount: '+0.015 Venom',
  imageUrl:
  'https://testnet.web3.world/token-icons/VENOM.png',
},
]

export default function History() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
      {events.map((e) => (
        <div
          key={e.timestamp}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={e.imageUrl} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{e.type}</p>
              <p className="truncate text-sm text-gray-500">{e.amount}</p>
            </a>
          </div>
          <div className="flex-2">
          <p className="text-sm font-medium text-gray-800">{new Date(e.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
