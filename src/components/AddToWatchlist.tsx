import { useState, useEffect, Fragment } from 'react';
import WatchlistService, { WatchlistEntry } from '../lib/watchlist.api';
import { Dialog, Transition } from '@headlessui/react'
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline'
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';

interface WatchlistProps {
  walletAddress: string;
  userAddress: string;
}

export default function AddToWatchlist({ userAddress, walletAddress }: WatchlistProps) {
  const [watchlist, setWatchlist] = useState([]);
  const [label, setLabel] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const loadWatchlist = async () => {
    try {
      const watchlist = await WatchlistService.getWatchlist(userAddress);
      setWatchlist(watchlist);
      setLabel(watchlist[walletAddress].label ? watchlist[walletAddress].label : '')
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const handleAddToWatchlist = async () => {
    setUpdateLoading(true);
    try {
      await WatchlistService.addToWatchlist(userAddress, walletAddress, label);
      setLabel('');
      setModalOpen(false);
      loadWatchlist();
      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
      console.error('Error adding to watchlist:', error);
    }
  };


  const handleDeleteFromWatchlist = async () => {
    try {
      await WatchlistService.deleteFromWatchlist(userAddress, walletAddress);
      setModalEditOpen(false);
      loadWatchlist();
    } catch (error) {
      console.error('Error deleting from watchlist:', error);
    }
  };

  const handleUpdateWatchlistEntry = async () => {
    setUpdateLoading(true);
    try {
      await WatchlistService.updateWatchlistEntry(userAddress, walletAddress, label);
      setModalEditOpen(false);
      loadWatchlist();
      setUpdateLoading(false);

    } catch (error) {
      console.error('Error updating watchlist entry:', error);
    }
  };

  return (
    <>


      {watchlist[walletAddress] ? (
        <button className="btn cursor-pointer text-black  text-right" onClick={() => setModalEditOpen(true)}><SolidStarIcon width={20} height={20} className='mr-2' />Added to watchlist</button>
      ) : (
        <button className="btn cursor-pointer text-black  text-right" onClick={() => setModalOpen(true)}><OutlineStarIcon width={20} height={20} className='mr-2' />Add to watchlist</button>

      )}

      {modalOpen && (

        <>


          <Transition.Root show={modalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setModalOpen}>
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
                          <OutlineStarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Add to your watchlist
                          </Dialog.Title>
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">


                              <input
                                type="text"
                                placeholder="Label (Optional)"
                                className="border border-gray-300 text-gray-800 rounded px-4 py-2 mb-4 w-full"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                              />


                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-6">
                        <button
                          className="inline-flex w-full justify-center rounded-md   hover:bg-gray-50 px-3 py-2 text-sm font-semibold text-black shadow-sm ring-1 ring-inset ring-gray-300  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          type="button"
                          onClick={() => setModalOpen(false)}
                        >
                          Cancel
                        </button>

                        <button
                          className="mt-2 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

                          onClick={handleAddToWatchlist}
                        >
                          
                          {updateLoading ? (<>Saving..</>) : (<>Add to watchlist</>)}
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
                          <OutlineStarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Already in your watchlist
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">


                              <input
                                type="text"
                                placeholder="Label (Optional)"
                                className="border border-gray-300 text-gray-800 rounded px-4 py-2 mb-4 w-full"
                                value={label}
                                onBlur={() => {
                                  if (label.trim() === '') {
                                    setLabel(watchlist[walletAddress].label ? watchlist[walletAddress].label : '');
                                  }
                                }}
                                onChange={(e) => setLabel(e.target.value)}
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



      {/*  <div className="grid grid-cols-3 gap-4">
        {watchlist.map((entry: WatchlistEntry) => (
          <div
            key={entry._id}
            className="border border-gray-300 rounded p-4"
          >
            <h3 className="text-lg font-bold mb-2">{entry.walletAddress}</h3>
            <p className="text-sm mb-2">{entry.label}</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteFromWatchlist(entry._id)}
            >
              Delete
            </button>
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 mt-2 w-full"
              value={entry.label}
              onChange={(e) =>
                handleUpdateWatchlistEntry(entry._id, e.target.value)
              }
            />
          </div>
        ))}
      </div>
 */}
    </>

  );
};

