import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  FolderIcon,
  WalletIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Stats from './stats';

import { initVenomConnect } from '../lib/venom';
import VenomConnect from 'venom-connect';
import ConnectWallet from './connectWallet';
import SearchAccount from './searchAccount';

const navigation = [
  { name: 'My Wallet', href: '#', icon: HomeIcon, current: true },
]

const teams = [
  { id: 1, name: 'Top Tokens', href: '#', icon: WalletIcon, current: false },
  { id: 2, name: 'Top Traders', href: '#', icon: UsersIcon, current: false },
  { id: 3, name: 'Top LP', href: '#', icon: FolderIcon, current: false },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}




export default function Home() {
  // We will store token balance from contract


  const [searchAddressQuery, setSearchAddressQuery] = useState('');
  const [venomProvider, setVenomProvider] = useState<any>();
  const [address, setAddress] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>();
  const init = async () => {
    const _venomConnect = await initVenomConnect();
    setVenomConnect(_venomConnect);
  };
  useEffect(() => {
    init();
  }, []);



  // This method allows us to gen a wallet address from inpage provider
  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();
    return providerState?.permissions.accountInteraction?.address.toString();
  };
  // Any interaction with venom-wallet (address fetching is included) needs to be authentificated
  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };
  // This handler will be called after venomConnect.login() action
  // connect method returns provider to interact with wallet, so we just store it in state
  const onConnect = async (provider: any) => {
    setVenomProvider(provider);
    await onProviderReady(provider);
  };
  // This handler will be called after venomConnect.disconnect() action

  const onDisconnect = async () => {
    venomProvider?.disconnect();
    setAddress('');
  };



  // When our provider is ready, we need to get address and balance from.
  const onProviderReady = async (provider: any) => {
    const venomWalletAddress = provider ? await getAddress(provider) : undefined;
    setAddress(venomWalletAddress);
  };
  useEffect(() => {
    // connect event handler
    const off = venomConnect?.on('connect', onConnect);
    if (venomConnect) {
      checkAuth(venomConnect);
    }
    // just an empty callback, cuz we don't need it
    return () => {
      off?.();
    };
  }, [venomConnect]);


  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <htmlclassName="h-full bg-white">
        <bodyclassName="h-full">
        ```
      */}
  
    </>
  )
}
