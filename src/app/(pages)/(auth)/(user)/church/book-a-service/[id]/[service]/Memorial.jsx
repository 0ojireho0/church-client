'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'

// Components
import { MoonLoader } from 'react-spinners'
import MemorialDateTime from './components/MemorialDateTime'
import dayjs from 'dayjs'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'
import { useRouter } from 'next/navigation'

function Memorial({church, user, allChurch}) {


  const [showMemorialDateModal, setShowMemorialDateModal] = useState(false)
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
  const { memorialBook } = useBook()



  const handleSubmitMemorial = (data) => {


    if(!selectedDate || !selectedTime){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    if(files.length <= 0){
      Swal.fire({
        title: "Error",
        text: "Upload File is required",
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
    memorialBook({
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
    memorialBook({
      formData: passData,
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


    localStorage.setItem("memorial_form", JSON.stringify(fullData))
    localStorage.setItem("recommended_church", JSON.stringify(recommended))

    router.push('/church/recommended-church/memorial')
  }

  useEffect(() => {
    const getMemorialForm = JSON.parse(localStorage.getItem('memorial_form'))

    if (!getMemorialForm) {
      // console.log("wala") // No saved form
    } else {
      // console.log("meron", getBaptismForm) // Restore the form
      reset(getMemorialForm)

      // Restore other selections manually
      if (getMemorialForm.selectedPayment) setSelectedPayment(getMemorialForm.selectedPayment)

    }
  }, [reset])

  const handleBackBtn = () => {
    localStorage.removeItem('memorial_form')
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
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Memorial Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <form onSubmit={handleSubmit(handleSubmitMemorial)}> 
          <div className='px-24 flex flex-col md:items-start '>
            <div className='md:grid grid-cols-2 gap-5 items-center'>
              <label className='text-end'>DATE OF REQUEST: </label>
              <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer' onClick={() => setShowMemorialDateModal(true)}>{selectedDate && selectedTime ? `${dayjs(selectedDate).format('MMMM DD, YYYY')} ${dayjs(selectedTime, 'HH:mm:ss').format('hh:mm A')}` : "Select Date & Time"}</h1>
              <label className='text-end' htmlFor='funeral_home_name'>FUNERAL HOME NAME: </label>
              <div className='flex flex-col'>
                <input type="text" id='funeral_home_name' className='border w-full p-2 outline-none rounded-lg bg-neutral-200' 
                  {...register('funeral_home_name', {
                    required: `Funeral Home Name is required`
                  })}
                />
                {error.funeral_home_name && <span className='text-red-500 text-sm '>{error.funeral_home_name.message}</span>}
              </div>
              <label className='text-end' htmlFor='funeral_mailing_address'>FUNERAL MAILING ADDRESS: </label>
              <div className='flex flex-col'>
                <input type="text" id='funeral_mailing_address' className='border w-full p-2 outline-none rounded-lg bg-neutral-200' 
                  {...register('funeral_mailing_address', {
                    required: `Funeral Mailing Address is required`
                  })}
                />
                {error.funeral_mailing_address && <span className='text-red-500 text-sm '>{error.funeral_mailing_address.message}</span>}
              </div>
            </div>
          </div>

          <div className='px-24 grid md:grid-cols-2 lg:grid-cols-3 items-start justify-center my-10 gap-10'>
            <div className='border-2 border-black/30 p-2 rounded-lg '>
              <h1 className='font-bold josefin-regular text-center'>DECEASED INFORMATION</h1>
              
              <div className='grid md:grid-cols-2 items-center justify-center my-3 gap-3'>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_fullname" className='text-start'>Full Name: </label>
                  <input type="text" id='deceased_fullname' className='border rounded-md p-2 outline-none' 
                    {...register('deceased_fullname', {
                      required: `Fullname is required`
                    })}
                  />
                  {error.deceased_fullname && <span className='text-red-500 text-sm '>{error.deceased_fullname.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_gender" className='text-start'>Gender: </label>
                  <select 
                    name="deceased_gender" 
                    id="deceased_gender" 
                    className='border rounded-md p-2 outline-none'
                    {...register('deceased_gender', {
                      required: 'Gender is required'
                    })}
                    >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {error.deceased_gender && <span className='text-red-500 text-sm '>{error.deceased_gender.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_dod" className='text-start'>Date of Death: </label>
                    <Controller
                      name="deceased_dod"
                      control={control}
                      rules={{ required: 'Date of Death is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.deceased_dod && <span className='text-red-500 text-sm '>{error.deceased_dod.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_dob" className='text-start'>Date of Burial: </label>
                    <Controller
                      name="deceased_dob"
                      control={control}
                      rules={{ required: 'Date of Burial is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.deceased_dob && <span className='text-red-500 text-sm '>{error.deceased_dob.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="deceased_age" className='text-start'>Age: </label>
                  <input type="number" id='deceased_age' className='border rounded-md p-2 outline-none' 
                    {...register('deceased_age', {
                      required: `Age is required`
                    })}
                  />
                  {error.deceased_age && <span className='text-red-500 text-sm '>{error.deceased_age.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="plot" className='text-start'>Plot Reserved? </label>
                  <input type="text" id='plot' className='border rounded-md p-2 outline-none' 
                    {...register('plot', {
                      required: `Plot is required`
                    })}
                  />
                  {error.plot && <span className='text-red-500 text-sm '>{error.plot.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="loc_plot" className='text-start'>Location of Plot:  </label>
                  <input type="text" id='loc_plot' className='border rounded-md p-2 outline-none' 
                    {...register('loc_plot', {
                      required: `Location of Plot is required`
                    })}
                  />
                  {error.loc_plot && <span className='text-red-500 text-sm '>{error.loc_plot.message}</span>}
                </div>

              </div>
            </div>
            <div className='border-2 border-black/30 p-2 rounded-lg '>
              <h1 className='font-bold josefin-regular text-center'>SPOUSE INFORMATION</h1>
              <div className='grid grid-cols-2 items-center justify-center my-3 gap-3'>
                
                <div className='flex flex-col'>
                  <label htmlFor="spouse_fullname" className='text-start'>Full Name: </label>
                  <input type="text" id='spouse_fullname' className='border rounded-md p-2 outline-none' 
                    {...register('spouse_fullname', {
                      required: `Full Name is required`
                    })}
                  />
                  {error.spouse_fullname && <span className='text-red-500 text-sm '>{error.spouse_fullname.message}</span>}
                </div>

                <div className='flex flex-col'>
                  <label htmlFor="spouse_gender" className='text-start'>Gender: </label>
                  <select 
                    name="spouse_gender" 
                    id="spouse_gender" 
                    className='border rounded-md p-2 outline-none'
                    {...register('spouse_gender', {
                      required: 'Gender is required'
                    })}
                    >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {error.spouse_gender && <span className='text-red-500 text-sm '>{error.spouse_gender.message}</span>}
                </div>

           
                  <label htmlFor="spouse_deceased" className='text-start'>Deceased? </label>
                    <Controller
                      name="spouse_deceased"
                      control={control}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.spouse_deceased && <span className='text-red-500 text-sm '>{error.spouse_deceased.message}</span>}
           

                <label htmlFor="losr" className='text-start'>Location of Spouse Remains: </label>
                <div className='flex flex-col'>
                  <input type="text" id='losr' className='border rounded-md p-2 outline-none' 
                    {...register('losr', {
                      required: `Location of Spouse Remains is required`
                    })}
                  />
                  {error.losr && <span className='text-red-500 text-sm '>{error.losr.message}</span>}
                </div>
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

                <div className="flex flex-col justify-center items-center">
                  <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS & PROOF OF PAYMENT</h1>
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
                  />
                </div>
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
            <div>
              <h1 className='josefin-regular font-bold'>It is the responsibility of the Funeral Director to:</h1>
              <ul className='list-disc'>
                <li className='text-justify'>Supply all burial permit copies and cremation certificates.</li>
                <li className='text-justify'>Ensure that all necessary documentation is properly completed and submitted to the parish office in a timely manner.</li>
                <li className='text-justify'>Coordinate with the parish regarding the schedule and logistics of the funeral service, if it is to be held within church premises.</li>
                <li className='text-justify'>Notify the parish if there are any changes or delays in document processing or scheduling.</li>
              </ul>
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
    
    {showMemorialDateModal && <MemorialDateTime 
                                setShowMemorialDateModal={setShowMemorialDateModal} 
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                                selectedTime={selectedTime}
                                setSelectedTime={setSelectedTime}
                                setFullyBooked={setFullyBooked}
                                church_id={church?.id}
                                />
                                }

    {showOnlinePaymentModal && (
      <>
      <div className='fixed inset-0 bg-black/50 flex justify-center items-center px-2 z-[1000]'>
        <div className='bg-white w-full md:w-1/2 py-2 px-4 rounded-lg'>
          <h1 className='josefin-regular font-bold text-sm text-center'>Here are the steps for confirmation of your booking!</h1>
          <h1 className='text-sm josefin-regular font-bold mt-3'>1. Send the full payment amount to GCASH/Bank Transfer:</h1>
          <div className='flex flex-col items-center'>
            <h1 className='text-sm font-bold josefin-regular'>GCASH</h1>
            <h1 className='josefin-regular text-sm'>09950249111</h1>
            <h1 className='josefin-regular text-sm'>Shyanne Kylie Dela Rosa</h1>
          </div>
          <div className='flex flex-col items-center mt-3'>
            <h1 className='text-sm font-bold josefin-regular'>Bank Transfer</h1>
            <h1 className='josefin-regular text-sm'>Account #: 1234 567 890</h1>
            <h1 className='josefin-regular text-sm'>Account Name: Juan Dela Cruz</h1>
          </div>
          <h1 className='text-sm josefin-regular font-bold mt-3'>2. Upload your Proof of Payment under the 'Requirements & Payment' section </h1>
          {/* <h1 className='text-sm josefin-regular text-center'>quiapochurch@gmail.com</h1> */}
          <h1 className='text-sm josefin-regular font-bold mt-3'>3. Wait for our confirmation email within 24 hours upon submitting your application/request form. (If you did not receive a confirmation email, please contact us at churchconnect05@gmail.com) </h1>
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

export default Memorial
