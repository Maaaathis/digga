import isValidDomain from 'is-valid-domain';
import { isbot } from 'isbot';
import { ExternalLinkIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { FC, ReactElement, ReactNode } from 'react';

import { ShareButton } from '@/app/lookup/[domain]/_components/ShareButton';
import SubdomainsRow from '@/app/lookup/[domain]/_components/SubdomainsRow';
import ExternalFavicon from '@/components/ExternalFavicon';
import RelatedDomains from '@/components/RelatedDomains';
import ResultsTabs from '@/components/ResultsTabs';
import SearchForm from '@/components/SearchForm';

type LookupLayoutProps = {
  children: ReactNode;
  params: {
    domain: string;
  };
};

export const generateMetadata = ({
  params: { domain },
}: LookupLayoutProps): Metadata => ({
  title: `Results for ${domain} · digga`,
  openGraph: {
    type: 'website',
    title: `Results for ${domain} · digga`,
    description: `Find DNS records, WHOIS data, SSL/TLS certificate history and more for ${domain}`,
  },
});

const LookupLayout: FC<LookupLayoutProps> = ({
  children,
  params: { domain },
}): ReactElement => {
  if (!isValidDomain(domain)) {
    return notFound();
  }

  const userAgent = headers().get('user-agent');
  const isBotRequest = !userAgent || isbot(userAgent);

  let isStandalone = false;

  return (
    <>
      <div
        className={`container mb-8 w-full md:w-5/6 xl:w-4/6 2xl:w-2/4 ${
          isStandalone ? 'hidden' : null
        }`}
      >
        <SearchForm
          initialValue={domain}
          autofocus={false}
          className="bg-background"
        />
      </div>
      <div className="container">
        <h1 className="mb-2">
          <span className="block text-muted-foreground">Results for</span>
          <span className="flex flex-row gap-2">
            <ExternalFavicon url={domain} />
            <Link
              className="block font-clash text-4xl font-bold tracking-wider decoration-muted-foreground underline-offset-4 hover:underline"
              href={`https://${domain}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {domain} <ExternalLinkIcon className="inline-block" />
            </Link>
          </span>
        </h1>
        <div className="mb-4 mt-2 flex flex-row gap-2">
          <ShareButton />
          <div className="my-auto inline-block h-full min-h-[1em] w-0.5 self-stretch rounded bg-secondary-foreground" />
          <RelatedDomains domain={domain} />
          {!isBotRequest && <SubdomainsRow domain={domain} />}
        </div>
        <ResultsTabs domain={domain} />
        {children}
      </div>
    </>
  );
};

export default LookupLayout;
