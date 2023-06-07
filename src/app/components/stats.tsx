import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
import { CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import LineChart from './chart';
import History from './history';

const stats = [
  { id: 1, name: 'Wallet', stat: '35.20$', icon: CurrencyDollarIcon, change: '2.3%', changeType: 'increase', colSpan: true, chart: true },
  { id: 2, stat: 'History', icon: ClockIcon, change: '', changeType: '', colSpan: false, history: true },]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Stats() {
  return (
    <>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className={`${item.colSpan && `lg:col-span-2`} relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6`}
          >
            <>
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                {item.name &&
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                }
              </dt>

              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                {item.stat &&
                  <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
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
                <div className='w-full'>
                  <LineChart lineColor={item.changeType === 'increase' ? 'green' : 'red'} />
                </div>
              }

              {item.history &&
                <div className='w-full'>
                  <History />
                </div>
              }


              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    View all<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </>

          </div>
        ))}
      </dl>
    </>
  )
}
