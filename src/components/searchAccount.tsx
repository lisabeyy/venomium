

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { searchAccount } from '../lib/venomScanApi';
import {
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SearchAccountProps {
  onResultClick?(address: string): void;
}
export default function SearchAccount({onResultClick}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [addressSelected, setAddressSelected] = useState('');

  const [loading, setLoading] = useState(false);
  const [showNoResultMsg, setShowNoResultMsg] = useState(false);
  const [results, setResults] = useState<any>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const fetchResult = async () => {
    setLoading(true);
    const result = await searchAccount(searchTerm);
    console.log('search result', result);
    if (result.body.length < 1 && result.status == 200) {
      setShowNoResultMsg(true);
    }
    setResults(result.body);
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length > 0) {
        fetchResult();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleCloseResults = () => {
    setSearchTerm('');
    setAddressSelected('');
    setResults([]);
    setShowNoResultMsg(false);
    setLoading(false);
  };

  const handleClickOutside = (event) => {
    if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
      setLoading(false);
      setShowNoResultMsg(false);
      setResults([]);
    }
  };


  const handleResultClick = (account) => {
    setAddressSelected(account.data.address);
    setLoading(false);
    setShowNoResultMsg(false);
    setResults([]);
    onResultClick(account.data.address);
    // Launch the getAccount function with the selected account
    // getAccount(account);
  };

  return (
    <div ref={autocompleteRef} className='container mx-auto mt-4 text-black'>
      <div className='relative'>
        <input
          type="text"
          value={addressSelected ? addressSelected : searchTerm}
          onChange={handleSearch}
          placeholder="Search for an account"
          className="px-4 py-2 text-gray-800 rounded-lg border border-gray-300 focus:outline-none"
        />
        {(searchTerm || addressSelected) && (
          <button
            onClick={handleCloseResults}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            Clear search
            <XMarkIcon className="ml-1 h-4 w-4 inline" />
          </button>
        )}
      </div>

      {loading &&
        <ul className="absolute z-10 w-full overflow-y-auto bg-white border border-gray-300 rounded-md mt-1">
          <li className='px-4 py-4'>
            <span>Loading...</span>

          </li>
        </ul>
      }


      {showNoResultMsg &&
        <ul className="absolute z-10 w-full overflow-y-auto bg-white border border-gray-300 rounded-md mt-1">
          <li className='px-4 py-4'>
            <span>No account found</span>

          </li>
        </ul>
      }
      {results && results.length > 0 && (
        <div className="absolute list-none z-10 w-full max-h-[140px] overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1">
          {results.map((result) => (
            <li
              key={result.data.address}
              onClick={() => handleResultClick(result)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <span className="w-fill flex ">
                <UserCircleIcon color='#05ED9F' className="h-5 w-5 mr-2" aria-hidden="true" /> {result.data.address}
              </span>
            </li>
          ))}

        </div>
      )}
    </div>
  );
};

