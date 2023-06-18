import { Kind, Transaction } from "../types/transactions.type";
import React, { useEffect, useState } from 'react';
import { getAmountWithDecimal, retrieveImage } from "../utils/tokens.utils";
import { capitalizeFirstLetter } from "../utils/global.utils";


interface HistoryProps {
  loading: boolean;
  transactions?: Transaction[];
}


export default function History({ loading, transactions }: HistoryProps) {

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">

      {loading &&
        <div className="text-center pt-12">
          <span className="w-full pb-4">Loading history..</span>
          <div className="mt-4" role="status">
            <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>

      }


      {transactions && !loading &&
        <>
          {transactions.map((e) => (
            <div
              key={e.blockTime + '' + e.token + '' + e.amount}
              className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
            >
              <div className="flex-shrink-0">
                {!e.imageUrl &&
                  <>

                    <img className="rounded-full" width={24} height={24} src={retrieveImage(e.token)} alt="" />

                  </>
                }

                {e.imageUrl &&
                  <>

                    <img className="rounded-full" width={24} height={24} src={e.imageUrl} alt="" />

                  </>
                }

              </div>
              <div className="min-w-0 flex-1">
                <a href="#" className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">{capitalizeFirstLetter(e.kind)}</p>
                  <p className="truncate text-sm text-gray-500">{getAmountWithDecimal(+e.amount, e.token).toFixed(6)}</p>
                </a>
              </div>
              <div className="flex-2">
                <p className="text-sm font-medium text-gray-800">{new Date(e.blockTime).toLocaleTimeString()}</p>
                <p className="text-xs font-normal text-gray-500">{new Date(e.blockTime).toLocaleDateString()}</p>

              </div>
            </div>
          ))}
        </>
        
      }

    </div>
  )
}
