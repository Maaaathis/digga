import ReactCountryFlag from 'react-country-flag';
import whoiser from 'whoiser';

import DnsTable from '@/components/DnsTable';
import DomainNotRegistered from '@/components/DomainNotRegistered';
import { isAvailable } from '@/lib/whois';
import DnsLookup from '@/utils/DnsLookup';

export const fetchCache = 'default-no-store';

const LookupDomain = async ({ params: { domain } }) => {
  const records = await DnsLookup.resolveAllRecords(domain);

  const whoisResult = whoiser.firstResult(
    await whoiser(domain, {
      timeout: 3000,
    })
  );

  if ((await isAvailable(domain)) !== 'registered') {
    return <DomainNotRegistered />;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="h-full md:col-span-2">
          <div className="h-full rounded-xl bg-slate-100 px-8 py-5 dark:bg-slate-950 md:flex">
            <div>
              <span className="rounded-lg bg-slate-200 px-2 py-1 text-sm font-extrabold uppercase text-slate-950 dark:bg-slate-900 dark:text-slate-50">
                Dates
              </span>
            </div>
            <div className="grid gap-4 md:m-auto md:grid-cols-3">
              {whoisResult['Created Date'] ? (
                <div className="flex flex-col text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {new Date(whoisResult['Created Date']).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                  <p className="text-lg font-light text-slate-900 dark:text-slate-100">
                    {new Date(whoisResult['Created Date']).toLocaleTimeString(
                      'en-US',
                      {
                        hour: 'numeric',
                        minute: 'numeric',
                      }
                    )}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Domain registered
                  </p>
                </div>
              ) : null}
              {whoisResult['Updated Date'] ? (
                <div className="flex flex-col text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {new Date(whoisResult['Updated Date']).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                  <p className="text-lg font-light text-slate-900 dark:text-slate-100">
                    {new Date(whoisResult['Updated Date']).toLocaleTimeString(
                      'en-US',
                      {
                        hour: 'numeric',
                        minute: 'numeric',
                      }
                    )}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Updated
                  </p>
                </div>
              ) : null}
              {whoisResult['Expiry Date'] ? (
                <div className="flex flex-col text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {new Date(whoisResult['Expiry Date']).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                  <p className="text-lg font-light text-slate-900 dark:text-slate-100">
                    {new Date(whoisResult['Expiry Date']).toLocaleTimeString(
                      'en-US',
                      {
                        hour: 'numeric',
                        minute: 'numeric',
                      }
                    )}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Domain expiration
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          {whoisResult['Registrant Organization'] ? (
            <div
              className={`rounded-xl bg-slate-100 px-8 py-5 dark:bg-slate-950 ${
                !whoisResult['Registrar'] ? 'h-full' : ''
              }`}
            >
              <div className="flex flex-row justify-between">
                <span className="rounded-lg bg-slate-200 px-2 py-1 text-sm font-extrabold uppercase text-slate-950 dark:bg-slate-900 dark:text-slate-50">
                  Domain Owner
                </span>
                <ReactCountryFlag
                  countryCode={whoisResult['Registrant Country']}
                  svg
                  style={{
                    fontSize: '1.75em',
                    lineHeight: '1.75em',
                    borderRadius: '20%',
                  }}
                />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {whoisResult['Registrant Organization']}
                </p>
              </div>
            </div>
          ) : null}
          {!whoisResult['Registrant Organization'] &&
          whoisResult['Registrant Country'] ? (
            <div
              className={`rounded-xl bg-slate-100 px-8 py-5 dark:bg-slate-950 ${
                !whoisResult['Registrar'] ? 'h-full' : ''
              }`}
            >
              <div className="flex flex-row justify-between">
                <span className="rounded-lg bg-slate-200 px-2 py-1 text-sm font-extrabold uppercase text-slate-950 dark:bg-slate-900 dark:text-slate-50">
                  Domain Owner
                </span>
                <ReactCountryFlag
                  countryCode={whoisResult['Registrant Country']}
                  svg
                  style={{
                    fontSize: '1.75rem',
                    lineHeight: '1.75rem',
                    borderRadius: '25%',
                  }}
                />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {whoisResult['Registrant State/Province']}
                </p>
              </div>
            </div>
          ) : null}
          {whoisResult['Registrar'] ? (
            <div
              className={`rounded-xl bg-slate-100 px-8 py-5 dark:bg-slate-950 ${
                !whoisResult['Registrant Organization'] &&
                !whoisResult['Registrant Country']
                  ? 'h-full'
                  : ''
              }`}
            >
              <div className="flex flex-row justify-between">
                <span className="rounded-lg bg-slate-200 px-2 py-1 text-sm font-extrabold uppercase text-slate-950 dark:bg-slate-900 dark:text-slate-50">
                  Domain Registry
                </span>
                <ReactCountryFlag
                  countryCode={whoisResult['Registrant Country']}
                  svg
                  style={{
                    fontSize: '1.75em',
                    lineHeight: '1.75em',
                    borderRadius: '20%',
                  }}
                />
              </div>
              <div className="mt-4">
                <a
                  href={whoisResult['Registrar URL']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-bold text-slate-900 decoration-slate-700 decoration-dotted underline-offset-4 hover:underline dark:text-slate-100 dark:decoration-slate-300"
                >
                  {whoisResult['Registrar']}
                </a>
              </div>
            </div>
          ) : null}
        </div>
        <div className="relative col-span-1 w-full">
          <img
            src="https://www.stuttgarter-nachrichten.de/media.media.129d97af-13ca-4d8b-a2e5-5f0e21903ff0.original1024.jpg"
            className="h-56 rounded-xl"
            alt=""
          />

          <div className="absolute top-0 flex h-56 w-full rounded-xl bg-orange-500 bg-opacity-40">
            <img
              className="m-auto h-16"
              src="https://companieslogo.com/img/orig/NET_BIG-03fc28ae.png?t=1647436387"
              alt=""
            />
          </div>

          <button className="absolute top-0 flex w-full cursor-pointer p-2">
            <img
              className="ml-auto h-6 w-6"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/480px-Infobox_info_icon.svg.png"
              alt=""
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default LookupDomain;
