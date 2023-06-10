import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from '@heroicons/react/20/solid'
import { CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import LineChart from './chart';
import History from './history';
import { Transaction } from '../types/transactions.type';
import React, { useEffect, useState } from 'react';
import { fetchAssets, fetchTransactions } from '../lib/venomScanApi';
import { getAmountWithDecimal, retrieveImage } from '../utils/tokens.utils';
let stats = [
  { id: 1, name: 'Wallet', stat: '', icon: CurrencyDollarIcon, change: '', changeType: '', colSpan: true, chart: true },
  { id: 2, stat: 'History', icon: ClockIcon, change: '', changeType: '', colSpan: false, history: true },]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface StatsProps {
  address: string;
}

export default function Stats({ address }: StatsProps) {

  const [transactions, setTransactions] = useState<Transaction[]>();
  const [tokensBalance, setTokensBalance] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAsset, setLoadingAsset] = useState<boolean>(true);
  const getAssets = async (walletAddress) => {

    const tokens = await fetchAssets(walletAddress);
    const venomBalance = tokens.find(t =>  t.token == 'Venom');
    console.log('venombalance', venomBalance);
    if (venomBalance) {
      stats[0].stat = (+venomBalance?.amount / (10 ** 9)).toString();
    }
    setTokensBalance(tokens);
    setLoadingAsset(false);
  }
  const getTransactions = async (walletAddress) => {

    const trxs = await fetchTransactions(walletAddress);
    const venomTrxs= trxs.filter(t =>  t.token == 'Venom');
    const firstVenomTrxAmount = +venomTrxs[0].amount / (10 ** 9);
    const lastVenomTrxAmount = +venomTrxs[venomTrxs.length - 1].amount / (10 ** 9);
    
   const percentageChange = ((lastVenomTrxAmount - firstVenomTrxAmount) / firstVenomTrxAmount) * 100
   stats[0].change = (percentageChange > 0 ? '+' : '-') + percentageChange.toFixed(2).toString() + ' %';
   stats[0].changeType = percentageChange > 0 ? 'increase' : 'decrease';
    setTransactions(trxs);
    setLoading(false);
  }
  useEffect(() => {
    if (address) {
      setLoading(true);
      getTransactions(address);
      getAssets(address);
    }
  }, [address])

  return (
    <>

      {!address && <>

        <h3 className='text-black text-center mt-8'>Connect your wallet to start tracking your portfolio or search for a wallet address in the top bar.</h3>
      </>}
      {address &&
        <>
          <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3>



          <div className='mb-4'>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.id}

                  className={classNames(
                    item.history ? 'overflow-visible' : 'overflow-hidden',
                    `${item.colSpan && `lg:col-span-2`} relative rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6`

                  )}

                >
                  <>
                    <dt>
                      <div className="absolute rounded-md bg-[#05ED9F] p-3">
                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {item.name &&
                        <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                      }
                    </dt>

                    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                      {item.stat &&
                        <p className="text-2xl font-semibold text-gray-900">
                        
                         <span> {item.stat}</span>
                         {item.chart && 
                            <img className="rounded-full inline ml-2 mb-1" width={24} height={24} src={retrieveImage('Venom')} alt="" />
                          }
                          </p>
                      }

                      {item.change &&
                        <p
                          className={classNames(
                            item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                            'ml-2 flex items-baseline text-sm font-semibold'
                          )}
                        >
                          {item.changeType === 'increase' ? (
                            <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                          ) : (
                            <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                          )}

                          <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                          {item.change}
                        </p>
                      }



                    </dd>
                  </>
                  <>
                    {item.chart &&

                      <>
                        <div className='w-full'>
                          <LineChart loading={loading} transactions={transactions} lineColor={item.changeType === 'increase' ? 'green' : 'red'} />
                        </div>


                        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                          <div className="text-sm">
                            <a href="#" className="font-medium hover:text-[#05ED9F] text-black">
                              View all<span className="sr-only"> {item.name} stats</span>
                            </a>
                          </div>
                        </div>
                      </>

                    }

                    {item.history &&
                      <div className='w-full h-[450px] overflow-y-scroll'>
                        <History loading={loading} transactions={transactions} />
                      </div>
                    }


                  </>

                </div>
              ))}
            </dl>
          </div>


          <dl className="mt-5 grid grid-cols-1 gap-5">
            <div
              className='relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6'
            >
              <dt>
                <div className="absolute rounded-md bg-[#05ED9F] p-3">
                  <WalletIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Portfolio</p>
              </dt>

              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">Assets</p>




              </dd>

              <div className="mt-8 flow-root w-full">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    {transactions && transactions.length > 0 &&

                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                              Asset
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Balance
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Price
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {tokensBalance &&

                            <>
                              {tokensBalance.map((t) => (
                                <tr key={t.token}>
                                  <td className="whitespace-nowrap flex-row py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                    <img className="rounded-full inline mr-2" width={24} height={24} src={retrieveImage(t.token)} alt="" />
                                   <span>{t.token}</span> 
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getAmountWithDecimal(+t.amount, t.token)}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">x</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">x</td>

                                </tr>
                              ))}
                            </>
                          }

                        </tbody>
                      </table>
                    }

                  </div>
                </div>
              </div>


            </div>
          </dl>
        </>
      }


    </>
  )
}
