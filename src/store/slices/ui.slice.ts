import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Theme = 'dark' | 'light'
type ModalType = 'createOrder' | 'assetDetail' | null

interface UIState {
  theme: Theme
  sidebarOpen: boolean
  activeModal: ModalType
  modalPayload: unknown
}

const initialState: UIState = {
  theme: 'dark',
  sidebarOpen: true,
  activeModal: null,
  modalPayload: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    openModal(
      state,
      action: PayloadAction<{ type: ModalType; payload?: unknown }>,
    ) {
      state.activeModal = action.payload.type
      state.modalPayload = action.payload.payload ?? null
    },
    closeModal(state) {
      state.activeModal = null
      state.modalPayload = null
    },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, openModal, closeModal } =
  uiSlice.actions
export default uiSlice.reducer
