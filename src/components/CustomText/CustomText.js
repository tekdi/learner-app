import React, { useEffect, useState } from 'react';
import { Text as UIKittenText } from '@ui-kitten/components';

const CustomText = (props) => (
  <UIKittenText {...props} allowFontScaling={false} />
);

export default CustomText;
