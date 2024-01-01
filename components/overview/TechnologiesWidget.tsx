import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import DashboardItem from '@/components/overview/DashboardItem';
import TechnologiesDetailsModal from '@/components/TechnologiesDetailsModal';

interface Props {
  domain: string;
}

type Technology = {
  name: string;
  category: number;
  icon: string;
  index: string;
  sourceUrl: string;
  detectedTime: number;
  latestDetectedTime: number;
  website: string;
  siteListUrl: string;
  categoryString?: string;
};

const TechnologiesWidget: React.FC<Props> = async ({
  domain,
}): Promise<React.ReactElement | null> => {
  const data = await requestAndParseTechnologies(domain);
  const technologies: Technology[] = [];

  if (!data) return null;

  Object.keys(data).forEach((key) => {
    data[key].forEach((technology: Technology) => {
      technology = {
        ...technology,
        categoryString: key,
      };

      technologies.push(technology);
    });
  });

  if (technologies.length === 0) return null;

  return (
    <DashboardItem title={`Technologies`}>
      <div className="grid h-full grid-cols-4">
        {technologies.map((technology: Technology) => {
          const arrayIndex = technologies.indexOf(technology);

          if (arrayIndex >= 7) return null;

          return (
            <Link
              key={technology.index}
              href={technology.website}
              className={`flex h-12 w-12 justify-center rounded-lg hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/5`}
            >
              <div className={`m-auto`}>
                <Image
                  src={`https://www.whatruns.com/imgs/${technology.icon}`}
                  alt={technology.name}
                  width={25}
                  height={25}
                />
              </div>
            </Link>
          );
        })}

        <TechnologiesDetailsModal technologies={technologies} />
      </div>
    </DashboardItem>
  );
};

async function requestAndParseTechnologies(domain: string) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  var urlencoded = new URLSearchParams();
  urlencoded.append(
    'data',
    '{"hostname": "' +
      domain +
      '", "url": "' +
      domain +
      '", "rawhostname": "' +
      domain +
      '"}'
  );

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
    next: {
      revalidate: true,
    },
  };

  const data = await fetch(
    'https://www.whatruns.com/api/v1/get_site_apps',
    // @ts-ignore
    requestOptions
  );

  const text = await data.text();

  const json = JSON.parse(text);

  const apps = json.apps;

  if (!apps) return null;

  const appsJson = JSON.parse(apps);

  const appsJsonKey = Object.keys(appsJson)[0];

  return appsJson[appsJsonKey];
}

export default TechnologiesWidget;
