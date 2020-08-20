import React, { Children } from 'react';
import { Box } from '@chakra-ui/core';

interface WrapperProps {
  variant?: 'small' | 'regular';
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = 'regular' }) => {
  return (
    <Box
      maxW={variant === 'regular' ? '800px' : '400px'}
      w="100%"
      mx="auto"
      mt={8}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
