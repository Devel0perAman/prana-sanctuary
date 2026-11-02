import { createContext, useContext } from 'react'
export const ConfigCtx = createContext({ paymentsEnabled: false, whatsappNumber: '', whatsappMessage: '', heroVideoUrl: '', razorpayKeyId: null })
export const useConfig = () => useContext(ConfigCtx)
