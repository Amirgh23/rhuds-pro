import uiReducer, {
  openModal,
  closeModal,
  closeAllModals,
  openDropdown,
  closeDropdown,
  closeAllDropdowns,
  addNotification,
  removeNotification,
  clearNotifications,
  UIState,
} from './uiSlice'

describe('uiSlice', () => {
  const initialState: UIState = {
    openModals: [],
    activeDropdowns: [],
    notifications: [],
  }

  it('returns initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('handles openModal', () => {
    const actual = uiReducer(initialState, openModal('modal-1'))
    expect(actual.openModals).toContain('modal-1')
  })

  it('does not add duplicate modals', () => {
    let state = uiReducer(initialState, openModal('modal-1'))
    state = uiReducer(state, openModal('modal-1'))
    expect(state.openModals).toEqual(['modal-1'])
  })

  it('handles closeModal', () => {
    const stateWithModal: UIState = {
      ...initialState,
      openModals: ['modal-1', 'modal-2'],
    }
    const actual = uiReducer(stateWithModal, closeModal('modal-1'))
    expect(actual.openModals).toEqual(['modal-2'])
  })

  it('handles closeAllModals', () => {
    const stateWithModals: UIState = {
      ...initialState,
      openModals: ['modal-1', 'modal-2'],
    }
    const actual = uiReducer(stateWithModals, closeAllModals())
    expect(actual.openModals).toEqual([])
  })

  it('handles openDropdown', () => {
    const actual = uiReducer(initialState, openDropdown('dropdown-1'))
    expect(actual.activeDropdowns).toContain('dropdown-1')
  })

  it('handles closeDropdown', () => {
    const stateWithDropdown: UIState = {
      ...initialState,
      activeDropdowns: ['dropdown-1', 'dropdown-2'],
    }
    const actual = uiReducer(stateWithDropdown, closeDropdown('dropdown-1'))
    expect(actual.activeDropdowns).toEqual(['dropdown-2'])
  })

  it('handles closeAllDropdowns', () => {
    const stateWithDropdowns: UIState = {
      ...initialState,
      activeDropdowns: ['dropdown-1', 'dropdown-2'],
    }
    const actual = uiReducer(stateWithDropdowns, closeAllDropdowns())
    expect(actual.activeDropdowns).toEqual([])
  })

  it('handles addNotification', () => {
    const notification = {
      id: 'notif-1',
      type: 'success' as const,
      message: 'Success!',
    }
    const actual = uiReducer(initialState, addNotification(notification))
    expect(actual.notifications).toContain(notification)
  })

  it('handles removeNotification', () => {
    const stateWithNotification: UIState = {
      ...initialState,
      notifications: [
        { id: 'notif-1', type: 'success', message: 'Success!' },
        { id: 'notif-2', type: 'error', message: 'Error!' },
      ],
    }
    const actual = uiReducer(stateWithNotification, removeNotification('notif-1'))
    expect(actual.notifications).toHaveLength(1)
    expect(actual.notifications[0].id).toEqual('notif-2')
  })

  it('handles clearNotifications', () => {
    const stateWithNotifications: UIState = {
      ...initialState,
      notifications: [
        { id: 'notif-1', type: 'success', message: 'Success!' },
        { id: 'notif-2', type: 'error', message: 'Error!' },
      ],
    }
    const actual = uiReducer(stateWithNotifications, clearNotifications())
    expect(actual.notifications).toEqual([])
  })
})
