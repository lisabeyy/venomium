
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  EllipsisHorizontalIcon,
  StarIcon

} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Stats from '../components/stats';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import WatchlistService, { WatchlistEntry } from '../lib/watchlist.api';
import { fetchAssets } from '../lib/venomScanApi';
import { retrieveImage } from '../utils/tokens.utils';



interface WatchlistProps {
  addressRedirect: string;
  userAddress?: string;
}

interface WatchListResponse {
  [key: string]: WatchlistEntry;
}


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Watchlist({ addressRedirect, userAddress }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [selectedWatchlistItem, setSelectedWatchlistItem] = useState<WatchlistEntry>();
  const [label, setLabel] = useState('');

  const fetchAssetsForWatchlist = async (watchlistArray: any[]) => {
    const assetPromises = watchlistArray.map(async (entry) => {
      const { walletAddress } = entry;

      try {
        const assets = await fetchAssets(walletAddress);
        const venomBalance = assets.body.tokenBalances.find(t => t.symbol == 'VENOM');
        return { ...entry, venomBalance: venomBalance };
      } catch (error) {
        console.log(`Error fetching assets for ${walletAddress}:`, error);
        return { ...entry, venomBalance: [] }; // Provide a default value for assets if there was an error
      }
    });

    const watchlistWithAssets = await Promise.all(assetPromises);

    setWatchlist(watchlistWithAssets);
    setLoading(false);
  }

  const loadWatchlist = async () => {
    try {
      const watchlist: WatchListResponse = await WatchlistService.getWatchlist(userAddress);


      const watchlistArray = await Promise.all(
        Object.entries(watchlist).map(async ([id, { label, walletAddress, createdAt }]) => {
          return { label, walletAddress, createdAt };
        })
      );
      fetchAssetsForWatchlist(watchlistArray);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const handleDeleteFromWatchlist = async () => {
    try {
      await WatchlistService.deleteFromWatchlist(userAddress, selectedWatchlistItem?.walletAddress);
      setModalEditOpen(false);
      loadWatchlist();
    } catch (error) {
      console.error('Error deleting from watchlist:', error);
    }
  };

  const handleUpdateWatchlistEntry = async () => {
    setUpdateLoading(true);
    try {
      await WatchlistService.updateWatchlistEntry(userAddress, selectedWatchlistItem?.walletAddress, label);
      setModalEditOpen(false);
      loadWatchlist();
      setUpdateLoading(false);

    } catch (error) {
      console.error('Error updating watchlist entry:', error);
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress) {
      setLoading(true);
      loadWatchlist();
    }

  }, [userAddress]);




  return (
    <main className="py-10 bg-white h-full overflow-y-scroll">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className='text-black text-xl font-medium'>My Watchlist</h2>

        {modalEditOpen && (

          <>


            <Transition.Root show={modalEditOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={setModalEditOpen}>
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
                            </Dialog.Title>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">


                                <input
                                  type="text"
                                  placeholder="Label (Optional)"
                                  className="border border-gray-300 text-gray-800 rounded px-4 py-2 mb-4 w-full"
                                  value={label}
                                  onChange={(e) => setLabel(e.target.value)}
                                  onBlur={() => {
                                    if (label.trim() === '') {
                                      setLabel(selectedWatchlistItem?.label ? selectedWatchlistItem?.label : '');
                                    }
                                  }}
                                />
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm text-red-600 hover:text-red-800 border border-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 text-center mr-2 mb-2 dark:border-red-600 dark:text-red-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            onClick={() => handleDeleteFromWatchlist()}
                          >
                            Remove  from watchlist
                          </button>

                          <button
                            className="inline-flex w-full justify-center rounded-md bg-[#11A97D] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f926c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11A97D]"
                            disabled={updateLoading}
                            onClick={handleUpdateWatchlistEntry}
                          >
                            {updateLoading ? (<>Saving..</>) : (<>Change Label</>)}
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </>

        )}








        {!userAddress ? (
          <p className='text-black mt-4 text-gray-800 '>In order to use this feature, you need to first connect your wallet.</p>
        ) : (
          <>
            <p className='text-black mt-4 text-gray-800' >Search for a wallet address and add it to your watchlist.</p>

            {!loading && (!watchlist || watchlist.length < 0) &&

              <p className='text-gray-800 text-lg text-center mt-40'>No results</p>
            }

          </>
        )}


        {loading &&
          <>
            <div className="text-center pt-12">
              <span className="w-full pb-4">Loading watchlist..</span>
              <div className="mt-4" role="status">
                <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </>
        }




        {watchlist && !loading && <>
          <ul role="list" className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
            {watchlist.map((entry) => (
              <li key={entry.walletAddress} className="overflow-hidden rounded-xl border border-gray-200">
                <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">

                  {entry.label ? (
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      <Link to={`/wallet/${entry.walletAddress}`} className='hover:text-[#05ED9F]'>
                        {entry.label}
                      </Link>
                    </div>

                  ) :

                    <div className="text-sm font-medium leading-6 text-gray-900">
                      <Link to={`/wallet/${entry.walletAddress}`} className='hover:text-[#05ED9F]'>
                        {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                      </Link>
                    </div>

                  }
                  <Menu as="div" className="relative ml-auto">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Open options</span>
                      <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link to={`/wallet/${entry.walletAddress}`}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              View<span className="sr-only"></span>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => { setSelectedWatchlistItem(entry); setLabel(entry.label || ''); setModalEditOpen(true) }}
                              className={classNames(
                                active ? 'bg-gray-50' : '',
                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                              )}
                            >
                              Edit<span className="sr-only"></span>
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">

                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Amount</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="font-medium text-gray-900">
                        {Number(entry.venomBalance.amount).toFixed(4)}
                        <img className="rounded-full inline ml-2 mb-1" width={24} height={24} src={retrieveImage('Venom')} alt="" />
                      </div>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Saved date</dt>
                    <dd className="text-gray-700">
                      <time dateTime={entry.createdAt._seconds}> {new Date(entry.createdAt._seconds * 1000).toLocaleDateString()} {new Date(entry.createdAt._seconds * 1000).toLocaleTimeString()} </time>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>

        </>}


      </div>
    </main>
  )
}



