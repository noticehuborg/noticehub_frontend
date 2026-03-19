import { createContext, useContext, useState } from 'react'

export const MODAL = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
  CREATE_PASSWORD: 'create-password',
  OTP: 'otp',
  CONFIRMATION: 'confirmation',
  SUCCESS: 'success',
}

const ModalContext = createContext(null)

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null)
  const [modalData, setModalData] = useState(null)

  const openModal = (modal, data = null) => { setActiveModal(modal); setModalData(data) }
  const closeModal = () => { setActiveModal(null); setModalData(null) }

  return (
    <ModalContext.Provider value={{ activeModal, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
