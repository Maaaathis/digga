import { Fragment } from 'react';
import whoiser, { type WhoisSearchResult } from 'whoiser';

const lookupWhois = async (domain: string) => {
  const result = await whoiser(domain, {
    raw: true,
    timeout: 3000,
  });

  const mappedResults: Record<string, string> = {};
  for (const key in result) {
    mappedResults[key] = (result[key] as WhoisSearchResult).__raw as string;
  }

  return mappedResults;
};

type WhoisResultsPageProps = {
  params: { domain: string };
};

const WhoisResultsPage = async ({
  params: { domain },
}: WhoisResultsPageProps) => {
  const data = await lookupWhois(domain);

  return (
    <>
      {Object.keys(data).map((key) => (
        <Fragment key={key}>
          <h2 className="mb-4 mt-8 text-3xl font-bold tracking-tight">{key}</h2>
          <code className="whitespace-pre-wrap">{data[key]}</code>
        </Fragment>
      ))}
    </>
  );
};

export default WhoisResultsPage;