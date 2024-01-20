import { Metadata } from 'next';
import { FC, ReactElement } from 'react';
import whoiser from 'whoiser';

import DnsRecordsWidget, {
  DnsRecordType,
} from '@/app/lookup/[domain]/(overview)/_components/DnsRecordsWidget';
import DomainDatesWidget from '@/app/lookup/[domain]/(overview)/_components/DomainDatesWidget';
import DomainlabelWidget from '@/app/lookup/[domain]/(overview)/_components/DomainlabelWidget';
import DomainOwnerInfoWidget from '@/app/lookup/[domain]/(overview)/_components/DomainOwnerInfoWidget';
import NameserverWidget from '@/app/lookup/[domain]/(overview)/_components/NameserverWidget';
import TechnologiesWidget from '@/app/lookup/[domain]/(overview)/_components/TechnologiesWidget';
import { getBaseDomain } from '@/lib/utils';
import { isDomainAvailable } from '@/lib/whois';

import DomainNotRegistered from '../../../../components/DomainNotRegistered';

export const fetchCache = 'default-no-store';

interface LookupDomainProps {
  params: {
    domain: string;
  };
}

export const generateMetadata = ({
  params: { domain },
}: LookupDomainProps): Metadata => {
  return {
    openGraph: {
      url: `/lookup/${domain}`,
    },
    alternates: {
      canonical: `/lookup/${domain}`,
    },
  };
};

const LookupDomain: FC<LookupDomainProps> = async ({
  params: { domain },
}): Promise<ReactElement> => {
  const baseDomain = getBaseDomain(domain);

  let whoisResult;
  try {
    // @ts-ignore
    whoisResult = whoiser.firstResult(
      await whoiser(baseDomain, {
        timeout: 3000,
      })
    );
  } catch (error) {
    console.error('Error fetching whois data:', error);
  }

  if (await isDomainAvailable(baseDomain)) {
    return <DomainNotRegistered />;
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {whoisResult && (
          <>
            <DomainDatesWidget whoisData={whoisResult} />
            <DomainOwnerInfoWidget whoisData={whoisResult} />
          </>
        )}
        <DnsRecordsWidget type={DnsRecordType.A} domain={domain} />
        {whoisResult && (
          <NameserverWidget whoisData={whoisResult} domain={domain} />
        )}
        <DnsRecordsWidget type={DnsRecordType.MX} domain={domain} />
        {whoisResult && <DomainlabelWidget whoisData={whoisResult} />}
        <TechnologiesWidget domain={domain} />
      </div>
    </>
  );
};

export default LookupDomain;