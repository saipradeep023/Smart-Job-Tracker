import { createContext, useContext, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from '../hooks/useLocalStorage'

/** Default empty applications list persisted to localStorage */
const STORAGE_KEY = 'job_tracker_applications'

const ApplicationContext = createContext(null)

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useLocalStorage(STORAGE_KEY, [])

  /** Add a new job application */
  const addApplication = useCallback((job) => {
    const newJob = {
      id: uuidv4(),
      company: '',
      role: '',
      location: '',
      salary: null,
      platform: '',
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      interviewDate: null,
      notes: '',
      bookmarked: false,
      ...job,
    }
    setApplications((prev) => [newJob, ...prev])
    return newJob
  }, [setApplications])

  /** Replace a job application by id */
  const updateApplication = useCallback((id, updatedData) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updatedData } : app))
    )
  }, [setApplications])

  /** Remove a job application by id */
  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id))
  }, [setApplications])

  /** Toggle the bookmarked flag */
  const toggleBookmark = useCallback((id) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
      )
    )
  }, [setApplications])

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        updateApplication,
        deleteApplication,
        toggleBookmark,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

/** Convenience hook — throws if used outside provider */
export const useApplications = () => {
  const ctx = useContext(ApplicationContext)
  if (!ctx) {
    throw new Error('useApplications must be used within an <ApplicationProvider>')
  }
  return ctx
}

export default ApplicationContext
