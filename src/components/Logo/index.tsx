import { Image } from 'antd';
import React from 'react';

import logo from './mapsmap-logo.png';

export const Logo = (props: any) => {
  return <Image src={logo} preview={false} {...props} />;
};

export default Logo;
