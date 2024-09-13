import { Endereco } from '@/UserContext'
import React from 'react'

const EnderecoTab = ({ endereco }:{endereco: Endereco | undefined}) => {
  return (
    <div>{JSON.stringify(endereco)}</div>
  )
}

export default EnderecoTab