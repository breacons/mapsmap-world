import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

type PageTitleProps = {
  title: string;
};

const MAPSMAP = 'Mapsmap'; // TODO
export function PageTitle({ title }: PageTitleProps) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

export default function Header(): ReactElement {
  return (
    <Helmet titleTemplate={`%s - ${MAPSMAP}`} defaultTitle={MAPSMAP}>
      <meta charSet="utf-8" />
      {/*<title>{MAPSMAP}</title>*/}
    </Helmet>
  );
}
