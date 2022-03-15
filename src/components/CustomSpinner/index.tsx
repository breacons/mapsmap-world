import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';

export const CustomSpinner = ({ size = 24, color = 'primary' }: any) => (
  <LoadingOutlined style={{ fontSize: size, color }} spin />
);

export default CustomSpinner;
