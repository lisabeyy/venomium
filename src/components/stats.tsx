import { ArrowDownIcon, ArrowUpIcon, WalletIcon } from '@heroicons/react/20/solid'
import { CurrencyDollarIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import LineChart from './chart';
import History from './history';
import { Transaction } from '../types/transactions.type';
import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { fetchAssets, fetchTransactions } from '../lib/venomScanApi';
import { getAmountWithDecimal, retrieveImage } from '../utils/tokens.utils';
import Logo from '../assets/logo_venomium.svg';

let stats = [
  { id: 1, name: 'Wallet', stat: '', value: '', icon: CurrencyDollarIcon, change: '', changeType: '', colSpan: true, chart: true },
  { id: 2, stat: 'History', icon: ClockIcon, change: '', changeType: '', colSpan: false, history: true },]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface StatsProps {
  address: string;
  userAddress?: string;
}

export default function Stats({ address, userAddress }: StatsProps) {

  const [openModal, setOpenModal] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [tokensBalance, setTokensBalance] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAsset, setLoadingAsset] = useState<boolean>(true);
  const getAssets = async (walletAddress) => {

    const response = await fetchAssets(walletAddress);
    const tokenBalances = response.body.tokenBalances;

    const venomBalance = tokenBalances.find(t => t.symbol == 'VENOM');
    if (venomBalance) {
      stats[0].stat = Number(venomBalance.amount).toFixed(4).toString();
      stats[0].value = (Number(venomBalance.amount) * Number(venomBalance.usdPrice)).toFixed(4);
    }

    tokenBalances.sort((a, b) => (Number(b.amount) * Number(b.usdPrice)) - (Number(a.amount) * Number(a.usdPrice)));
    setTokensBalance(tokenBalances);
    setLoadingAsset(false);
  }
  const getTransactions = async (walletAddress) => {

    const trxs = await fetchTransactions(walletAddress);
    const venomTrxs = trxs.filter(t => t.token == 'Venom');
    const firstVenomTrxAmount = +venomTrxs[0].amount / (10 ** 9);
    const lastVenomTrxAmount = +venomTrxs[venomTrxs.length - 1].amount / (10 ** 9);

    const percentageChange = ((lastVenomTrxAmount - firstVenomTrxAmount) / firstVenomTrxAmount) * 100
    stats[0].change = (percentageChange > 0 ? '+' : '') + percentageChange.toFixed(2).toString() + ' %';
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

      <Transition.Root show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <StarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Watchlist - Coming Soon
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Soon, you will be able to save a wallet to your watchlist and track their activities!
                          Track the performance of other portfolios!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setOpenModal(false)}
                    >
                      Go back to Venomium
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


      {!address && <>

        <h1 className='text-gray-800 mt-8 mb-8 text-center'>Welcome to  <img src={Logo} className="inline" width={120} alt="logo " /></h1>
        <h2 className='text-black text-center mt-8'>Connect your wallet to start tracking your portfolio or search for a wallet address in the top bar.</h2>
      </>}
      {address &&
        <>

          <div className="flex justify-between">
            <h3 className="text-base text-left font-semibold leading-6 text-gray-900">Last 30 days</h3>
            {userAddress && (address !== userAddress) &&
              <button className="btn cursor-pointer text-black  text-right" onClick={() => setOpenModal(true)}><StarIcon width={20} height={20} className='mr-2' />Add to watchlist</button>
            }
          </div>



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

                  {item.value &&
                        <p className="text-x ml-2">

                          <span className='text-gray-500'> ${item.value}</span>
                     
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

                    {loadingAsset &&
                      <div className="text-center pt-12">
                        <span className="w-full pb-4">Loading assets..</span>
                        <div className="mt-4" role="status">
                          <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>

                    }

                    {transactions && transactions.length > 0 &&

                      <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-gray-800 sm:pl-0">
                              Asset
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal text-gray-800">
                              Balance
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal text-gray-800">
                              Price
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-normal text-gray-800">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {tokensBalance &&

                            <>
                              {tokensBalance.map((t) => (
                                <tr key={t.token}>
                                  <td className="whitespace-nowrap flex-row py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-0">

                                    {t.rootAddress ? (
                                      <a href={`https://testnet.venomscan.com/tokens/${t.rootAddress}`} target='_blank' >
                                        <img className="rounded-full inline mr-2" width={24} height={24} src={retrieveImage(t.symbol)} alt="" />
                                        <span>{t.symbol}</span>
                                      </a>
                                    ) : (
                                      <>
                                        <img className="rounded-full inline mr-2" width={24} height={24} src={retrieveImage(t.symbol)} alt="" />
                                        <span>{t.symbol}</span>
                                      </>

                                    )}


                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">{Number(t.amount).toFixed(4)}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-800">${Number(t.usdPrice).toFixed(4)}</td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">${(Number(t.usdPrice) * Number(t.amount)).toFixed(4)}</td>

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
