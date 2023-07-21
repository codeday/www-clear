import React from 'react'
import {Box} from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme'


// I was too lazy to update topo and export this so just made one myself
export default function Kbd({
  children,
  ...props
}: any) {
  return (
    <Box
      borderRadius="md"
      mx={1}
      color="gray"
      bg={useColorModeValue('gray.100', 'whiteAlpha.100')}
      borderWidth={1}
      borderBottomWidth={3}
      fontWeight="bold"
      lineHeight="normal"
      whiteSpace="nowrap"
      px="0.4em"
      {...props}
    >
      {children}
    </Box>
  )
}
