import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useApplications } from '../context'
import PageTransition from '../components/PageTransition'

const schema = yup.object({
  company: yup.string().required('Company name is required'),
  role: yup.string().required('Role/Title is required'),
  location: yup.string(),
  salary: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .positive('Salary must be positive'),
  platform: yup.string(),
  status: yup.string().required(),
  appliedDate: yup.string().required('Applied date is required'),
  notes: yup.string(),
}).required()

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected']
const PLATFORMS = ['LinkedIn', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other']

const formInputClasses = "w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium rounded-2xl px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]"
const selectBgIcon = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`

const AddApplication = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { applications, addApplication, updateApplication } = useApplications()

  const isEditing = Boolean(id)
  const existingJob = isEditing ? applications.find((a) => a.id === id) : null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'Applied',
      appliedDate: new Date().toISOString().slice(0, 10),
    },
  })

  useEffect(() => {
    if (isEditing) {
      if (existingJob) {
        reset({
          ...existingJob,
          appliedDate: existingJob.appliedDate?.slice(0, 10) || '',
        })
      } else {
        toast.error('Application not found')
        navigate('/applications')
      }
    }
  }, [isEditing, existingJob, reset, navigate])

  const onSubmit = (data) => {
    try {
      if (isEditing) {
        updateApplication(id, data)
        toast.success('Application updated!')
      } else {
        addApplication(data)
        toast.success('Application added!')
      }
      navigate('/applications')
    } catch (err) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <PageTransition>
      <div className="p-6 md:p-10 max-w-4xl mx-auto flex flex-col min-h-full gap-8">
        
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Application' : 'Track New Job'}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            {isEditing ? 'Update the details of your application below.' : 'Enter the details of the job you applied for.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 gap-8">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2">Company Name *</label>
                <input type="text" {...register('company')} className={formInputClasses} placeholder="e.g. Google" />
                {errors.company && <p className="text-red-500 text-xs font-semibold mt-2">{errors.company.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2">Role / Title *</label>
                <input type="text" {...register('role')} className={formInputClasses} placeholder="e.g. Frontend Engineer" />
                {errors.role && <p className="text-red-500 text-xs font-semibold mt-2">{errors.role.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2">Status</label>
                <select 
                  {...register('status')} 
                  className={`${formInputClasses} pr-10 cursor-pointer appearance-none`}
                  style={{ backgroundImage: selectBgIcon, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2">Applied Date *</label>
                <input type="date" {...register('appliedDate')} className={formInputClasses} />
                {errors.appliedDate && <p className="text-red-500 text-xs font-semibold mt-2">{errors.appliedDate.message}</p>}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2">Location</label>
                <input type="text" {...register('location')} className={formInputClasses} placeholder="e.g. Remote, New York" />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-900 mb-2">Salary (Optional)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-500 font-semibold">$</span>
                  <input type="number" {...register('salary')} className={`${formInputClasses} pl-8`} placeholder="120000" />
                </div>
                {errors.salary && <p className="text-red-500 text-xs font-semibold mt-2">{errors.salary.message}</p>}
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-bold text-slate-900 mb-2">Platform</label>
                <select 
                  {...register('platform')} 
                  className={`${formInputClasses} pr-10 cursor-pointer appearance-none`}
                  style={{ backgroundImage: selectBgIcon, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="">Select Platform...</option>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <hr className="border-t border-slate-100 my-8" />

            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-900 mb-2">Notes</label>
              <textarea
                {...register('notes')}
                rows="5"
                className={`${formInputClasses} resize-y leading-relaxed`}
                placeholder="Interview details, recruiter info, etc."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-auto pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-slate-600 font-bold text-sm py-3 px-6 rounded-xl hover:bg-slate-100 transition-colors hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)] transition-all shrink-0"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  )
}

export default AddApplication
