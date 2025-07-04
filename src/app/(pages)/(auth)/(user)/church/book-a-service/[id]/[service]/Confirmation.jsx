'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'

// Components
import { MoonLoader } from 'react-spinners'
import dayjs from 'dayjs'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'


function Confirmation({church, user, allChurch}) {




  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [loading, setLoading] = useState(false)

  const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false)
  const [passData, setPassData] = useState()
  const [loadingDone, setLoadingDone] = useState(false)

  const [files, setFiles] = useState([])

  const router = useRouter()

  const payment = [
      {
          value: "cash",
          label: "Cash",
        
      },
      {
          value: "online",
          label: "Online Payment",
      },
  ]
  const { register, handleSubmit, reset, formState: {errors: error}, control, getValues } = useForm()
  const { confirmationBook } = useBook({})




  const handleSubmitConfirmation = (data) => {

    if(!selectedDate || !selectedTime ){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    const formData = new FormData()

    formData.append('jsonData', JSON.stringify(data))
    formData.append('date', dayjs(selectedDate).format('YYYY-MM-DD'))
    formData.append('selectedTime', selectedTime)
    formData.append('selectedPayment', selectedPayment)
    formData.append('church_id', church?.id)
    formData.append('user_id', user?.id)
    formData.append('fullyBooked', fullyBooked)

    files.forEach((file, index) => {
      formData.append(`files[]`, file)
    })

    if(selectedPayment === "online"){
      setShowOnlinePaymentModal(true)

      setPassData(formData)
      return
    }

    setLoading(true)
    confirmationBook({
      formData,
      reset,
      setLoading,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime,
      setShowOnlinePaymentModal,
      setLoadingDone,
      setFiles
    })
    
  }

  const handleDoneSubmit = () => {
    setLoadingDone(true)
    confirmationBook({
      formData,
      reset,
      setLoading,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime,
      setShowOnlinePaymentModal,
      setLoadingDone,
      setFiles
    })
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)

    const filteredFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024)

    if (filteredFiles.length !== selectedFiles.length) {
      Swal.fire({
        title: "File Too Large",
        text: "One or more files exceed the 10MB limit.",
        icon: "error"
      })
    }

    setFiles(prev => [...prev, ...filteredFiles])
  }

  const handleFileDelete = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
      const toRad = angle => (angle * Math.PI) / 180;
      const R = 6378; // Earth radius in km

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in km
  }
  function getNearestChurches(churches, targetChurchId, limit = 3) {
    const target = churches.find(ch => ch.id === targetChurchId);
    if (!target) throw new Error("Target church not found.");

    // Compute distances
    const distances = churches
        .filter(ch => ch.id !== targetChurchId) // exclude self
        .map(ch => ({
            ...ch,
            distance: haversineDistance(target.latitude, target.longitude, ch.latitude, ch.longitude)
        }));

    // Greedy: sort by distance and pick the closest 3
    distances.sort((a, b) => a.distance - b.distance);

    return distances.slice(0, limit);
  }

  const handleFindRecommendedChurch = () => {
    const formData = getValues()

    const fullData = {
      ...formData,
      selectedPayment,
      selectedDate,
      selectedTime,
      churchId: church?.id
    }

    const recommended = getNearestChurches(allChurch, church.id, 3)

    localStorage.setItem("confirmation_form", JSON.stringify(fullData))
    localStorage.setItem("recommended_church", JSON.stringify(recommended))

    router.push('/church/recommended-church/confirmation')
  }

  useEffect(() => {
    const getConfirmationForm = JSON.parse(localStorage.getItem('confirmation_form'))

    if (!getConfirmationForm) {
      // console.log("wala") // No saved form
    } else {
      // console.log("meron", getBaptismForm) // Restore the form
      reset(getConfirmationForm)

      // Restore other selections manually
      if (getConfirmationForm.selectedPayment) setSelectedPayment(getConfirmationForm.selectedPayment)

    }
  }, [reset])

  const handleBackBtn = () => {
    localStorage.removeItem('confirmation_form')
  }

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
  }


  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Confirmation Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
          <form onSubmit={handleSubmit(handleSubmitConfirmation)}>

            <div className='flex justify-center items-center my-5'>
              <CustomDateTimePicker 
                selectedDate={selectedDate} 
                setSelectedDate={setSelectedDate} 
                selectedTime={selectedTime} 
                setSelectedTime={setSelectedTime} 
                setFullyBooked={setFullyBooked}
                church_id={church?.id}
                />

            </div>
            <div className='grid gap-3 md:grid-cols-2 items-start'> 
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='fullname' className='border rounded-md p-2 outline-none'  
                      {...register('fullname', {
                        required: "Fullname is required"
                      })}
                    />
                    {error.fullname && <span className='text-red-500 text-sm '>{error.fullname.message}</span>}
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="dob" className='text-start'>Date of Birth: </label>
                    <Controller
                      name="dob"
                      control={control}
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.dob && <span className='text-red-500 text-sm '>{error.dob.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='pob' className='border rounded-md p-2 outline-none' 
                    {...register('pob', {
                        required: "Place of birth is required"
                      })}
                    />
                    {error.pob && <span className='text-red-500 text-sm '>{error.pob.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="father_name" className='text-start'>Father's Name: </label>
                    <input type="text" id='father_name' className='border rounded-md p-2 outline-none' 
                    {...register('father_name', {
                        required: "Father's name is required"
                      })}
                    />
                    {error.father_name && <span className='text-red-500 text-sm '>{error.father_name.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='mother_name' className='border rounded-md p-2 outline-none' 
                    {...register('mother_name', {
                        required: "Mother's name is required"
                      })}
                    />
                    {error.mother_name && <span className='text-red-500 text-sm '>{error.mother_name.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="purpose" className='text-start'>Purpose: </label>
                    <input type="text" id='purpose' className='border rounded-md p-2 outline-none' 
                    {...register('purpose', {
                        required: "Purpose is required"
                      })}
                    />
                    {error.purpose && <span className='text-red-500 text-sm '>{error.purpose.message}</span>}
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="contact" className='text-start'>Contact No: </label>
                    <input type="text" id='contact' className='border rounded-md p-2 outline-none' 
                    {...register('contact', {
                        required: "Contact is required"
                      })}
                    />
                    {error.contact && <span className='text-red-500 text-sm '>{error.contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
                  <ul className='list-inside list-disc'>
                    <li>Baptismal Certificate</li>
                    <li>Valid ID</li>
                    <li>Authorization Letter (if someone else is claiming the certificate)</li>
                  </ul>
                  <div className="flex flex-col items-center justify-center">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Upload File
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                    />
                    {files.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <div className="text-sm truncate max-w-xs">{file.name}</div>
                            <button
                              type="button"
                              className="text-red-500 hover:underline text-xs"
                              onClick={() => handleFileDelete(index)}
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <h1 className='font-bold josefin-regular text-center'>DONATION METHOD</h1>
                  <div className='flex justify-center items-center'>
                    <RowRadioButtonsGroup 
                        label={"Select a payment method"}
                        name="payment"
                        value={selectedPayment}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        options={payment}
                    
                    />
                  </div>
              </div>
            </div>


            <div className='flex justify-center items-center py-2 '>
                {loading ? (
                  <div className='flex items-center gap-10'>
                    <Link href={`/church/book-a-service/${church.id}`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700' onClick={handleBackBtn}>Back</Link>
                    <div className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>
                      <MoonLoader size={20} />
                    </div>
                    <h1 className='bg-green-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-green-700' onClick={handleFindRecommendedChurch}>Recommend Another Church</h1>
                  </div>
                ) : (
                <>
                  <div className='flex items-center gap-10'>
                    <Link href={`/church/book-a-service/${church.id}`} className='bg-red-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-red-700' onClick={handleBackBtn}>Back</Link>
                    <button type='submit' className='bg-blue-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-blue-700'>Submit</button>
                    <h1 className='bg-green-600 py-2 px-4 rounded-lg text-white cursor-pointer hover:bg-green-700' onClick={handleFindRecommendedChurch}>Recommend Another Church</h1>
                  </div>
                </>
                ) }
            </div>
          </form>
        </div>
      </div>
    </div>

    {showOnlinePaymentModal && (
      <>
      <div className='fixed inset-0 bg-black/50 flex justify-center items-center px-2'>
        <div className='bg-white w-full md:w-1/2 py-2 px-4 rounded-lg'>
          <h1 className='josefin-regular font-bold text-sm text-center'>Here are the steps for confirmation of your booking!</h1>
          <h1 className='text-sm josefin-regular font-bold mt-3'>1. Send the full payment amount to GCASH/Bank Transfer:</h1>
          <div className='flex flex-col items-center'>
            <h1 className='text-sm font-bold josefin-regular'>GCASH</h1>
            <h1 className='josefin-regular text-sm'>09123456789</h1>
            <h1 className='josefin-regular text-sm'>Juan Dela Cruz</h1>
          </div>
          <div className='flex flex-col items-center mt-3'>
            <h1 className='text-sm font-bold josefin-regular'>Bank Transfer</h1>
            <h1 className='josefin-regular text-sm'>Account #: 1234 567 890</h1>
            <h1 className='josefin-regular text-sm'>Account Name: Juan Dela Cruz</h1>
          </div>
          <h1 className='text-sm josefin-regular font-bold mt-3'>2. Send Proof of payment to our email: </h1>
          <h1 className='text-sm josefin-regular text-center'>quiapochurch@gmail.com</h1>
          <h1 className='text-sm josefin-regular font-bold mt-3'>3. Wait for our confirmation email within 24 hours upon sending your proof of payment via Email. (If you did not receive a confirmation email, please contact us.) </h1>
          <div className='mt-3 flex justify-center items-center gap-5'>
            {loadingDone ? (
              <>
              <div className='bg-red-600 py-1 px-6 rounded-lg'>
                <MoonLoader size={30} color='white' />
              </div>
              </>
            ) : (
              <>
              <h1 className='bg-red-600 hover:bg-red-700 text-white py-1 px-6 rounded-lg cursor-pointer' onClick={() => handleDoneSubmit()}>Done</h1>
              </>
            )}
            <h1 className='bg-blue-600 hover:bg-blue-700 text-white py-1 px-6 rounded-lg cursor-pointer' onClick={() => setShowOnlinePaymentModal(false)}>Cancel</h1>
          </div>

        </div>
      </div>


      </>
    )}
    
    
    
    </>
  )
}

export default Confirmation
