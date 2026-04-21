import { useContext } from 'react'
import SocketContext from './socketContext.js'

export const useSocket = () => useContext(SocketContext)
