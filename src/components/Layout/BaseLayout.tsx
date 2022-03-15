import { Layout, LayoutProps } from 'antd';
import React, { PropsWithChildren } from 'react';

type Props = LayoutProps;

export function BaseLayout(props: PropsWithChildren<Props>) {
  return <Layout style={{ backgroundColor: '#23213A' }}>{props.children}</Layout>;
}
