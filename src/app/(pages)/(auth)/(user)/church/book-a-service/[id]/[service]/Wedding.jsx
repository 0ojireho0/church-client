import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'

// Components
import { MoonLoader } from 'react-spinners'
import CustomDatePicker from '@/app/components/CustomDatePicker'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import RehearsalDateTime from './components/RehearsalDateTime'
import dayjs from 'dayjs'
import WeddingDateTime from './components/WeddingDateTime'
import Swal from 'sweetalert2'

import { useBook } from '@/app/hooks/book'
import { useRouter } from 'next/navigation'



function Wedding({church, user, allChurch}) {


  const [showRehearsalModal, setShowRehearsalModal] = useState(false)
  const [rehearsalSelectedDate, setRehearsalSelectedDate] = useState(null);
  const [rehearsalSelectedTime, setRehearsalSelectedTime] = useState(null);
  const [rehearsalFullyBooked, setRehearsalFullyBooked] = useState(null)

  const [showWeddingModal, setShowWeddingModal] = useState(false)
  const [weddingSelectedDate, setWeddingSelectedDate] = useState(null);
  const [weddingSelectedTime, setWeddingSelectedTime] = useState(null);
  const [weddingFullyBooked, setWeddingFullyBooked] = useState(null)

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

  const { weddingBook } = useBook({})


  const { register, handleSubmit, reset, formState: {errors: error}, control, getValues } = useForm()



  const handleSubmitWedding = (data) => {
    if(!rehearsalSelectedDate || !rehearsalSelectedTime || !weddingSelectedDate || !weddingSelectedTime){
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
    formData.append('rehearsal_date', dayjs(rehearsalSelectedDate).format('YYYY-MM-DD'))
    formData.append('rehearsal_time', rehearsalSelectedTime)
    formData.append('wedding_date', dayjs(weddingSelectedDate).format('YYYY-MM-DD'))
    formData.append('wedding_time', weddingSelectedTime)
    formData.append('selectedPayment', selectedPayment)
    formData.append('church_id', church?.id)
    formData.append('user_id', user?.id)
    formData.append('rehearsalFullyBooked', rehearsalFullyBooked)
    formData.append('weddingFullyBooked', weddingFullyBooked)

    files.forEach((file, index) => {
      formData.append(`files[]`, file)
    })

    if(selectedPayment === "online"){
      setShowOnlinePaymentModal(true)

      setPassData(formData)
      return
    }


    setLoading(true)

    weddingBook({
      formData,
      reset,
      setLoading,
      setSelectedPayment,
      setWeddingSelectedDate,
      setWeddingSelectedTime,
      setRehearsalSelectedDate,
      setRehearsalSelectedTime,
      setShowOnlinePaymentModal,
      setLoadingDone,
      setFiles
    })

  }

  const handleDoneSubmit = () => {
    setLoadingDone(true)
    weddingBook({
      formData: passData,
      reset,
      setLoading,
      setSelectedPayment,
      setWeddingSelectedDate,
      setWeddingSelectedTime,
      setRehearsalSelectedDate,
      setRehearsalSelectedTime,
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
      churchId: church?.id
    }

    const recommended = getNearestChurches(allChurch, church.id, 3)

    console.log(fullData, recommended)

    localStorage.setItem("wedding_form", JSON.stringify(fullData))
    localStorage.setItem("recommended_church", JSON.stringify(recommended))

    router.push('/church/recommended-church/wedding')
  }

  const handleBackBtn = () => {
    localStorage.removeItem('wedding_form')
  }

  useEffect(() => {
    const getWeddingForm = JSON.parse(localStorage.getItem('wedding_form'))

    if (!getWeddingForm) {
      // console.log("wala") // No saved form
    } else {
      // console.log("meron", getWeddingForm) // Restore the form
      reset(getWeddingForm)

      // Restore other selections manually
      if (getWeddingForm.selectedPayment) setSelectedPayment(getWeddingForm.selectedPayment)

    }
  }, [reset])

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
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Wedding Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex flex-col justify-center items-center gap-3'>
          <form onSubmit={handleSubmit(handleSubmitWedding)}>
            <div className='flex flex-col justify-center items-center my-5'>
                <h1 className='font-bold josefin-regular text-center'>WEDDING SCHEDULE</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label className='text-end'>REHEARSAL DATE & TIME: </label>
                  <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer' onClick={() => setShowRehearsalModal(true)}>{rehearsalSelectedDate && rehearsalSelectedTime ? `${dayjs(rehearsalSelectedDate).format('MMMM DD, YYYY')} ${dayjs(rehearsalSelectedTime, 'HH:mm:ss').format('hh:mm A')}` : "Select Date & Time"}</h1>
                  <label className='text-end'>WEDDING DATE & TIME: </label>
                  <h1 className='bg-blue-400 text-center text-white hover:bg-blue-500 rounded-lg py-2 px-4 cursor-pointer' onClick={() => setShowWeddingModal(true)}>{weddingSelectedDate && weddingSelectedTime ? `${dayjs(weddingSelectedDate).format('MMMM DD, YYYY')} ${dayjs(weddingSelectedTime, 'HH:mm:ss').format('hh:mm A')}` : "Select Date & Time"}</h1>

                </div>
            </div>
            <div className='grid gap-3 md:grid-cols-2 items-start'>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GROOM'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='groom_fullname' className='border rounded-md p-2 outline-none' 
                      {...register('groom_fullname', {
                        required: 'Fullname is required'
                      })}
                    />
                    {error.groom_fullname && <span className='text-red-500 text-sm '>{error.groom_fullname.message}</span>}
                  </div>

                 

                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_dob" className='text-start'>Date of Birth: </label>
                    <Controller
                      name="groom_dob"
                      control={control}
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.groom_dob && <span className='text-red-500 text-sm '>{error.groom_dob.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='groom_pob' className='border rounded-md p-2 outline-none' 
                      {...register('groom_pob', {
                        required: 'Place of birth is required'
                      })}
                    />
                    {error.groom_pob && <span className='text-red-500 text-sm '>{error.groom_pob.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_age" className='text-start'>Age: </label>
                    <input type="number" id='groom_age' className='border rounded-md p-2 outline-none' 
                      {...register('groom_age', {
                        required: 'Age is required'
                      })}
                    />
                    {error.groom_age && <span className='text-red-500 text-sm '>{error.groom_age.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_occupation" className='text-start'>Occupation: </label>
                    <input type="text" id='groom_occupation' className='border rounded-md p-2 outline-none' 
                      {...register('groom_occupation', {
                        required: 'Occupation is required'
                      })}
                    />
                    {error.groom_occupation && <span className='text-red-500 text-sm '>{error.groom_occupation.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_religion" className='text-start'>Religion: </label>
                    <input type="text" id='groom_religion' className='border rounded-md p-2 outline-none' 
                      {...register('groom_religion', {
                        required: 'Religion is required'
                      })}
                    />
                    {error.groom_religion && <span className='text-red-500 text-sm '>{error.groom_religion.message}</span>}
                  </div>

                </div>
              </div>
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>BRIDE'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_fullname" className='text-start'>Full Name: </label>
                    <input type="text" id='bride_fullname' className='border rounded-md p-2 outline-none' 
                      {...register('bride_fullname', {
                        required: `Full name is required`
                      })}
                    />
                    {error.bride_fullname && <span className='text-red-500 text-sm '>{error.bride_fullname.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_dob" className='text-start'>Date of Birth: </label>
                    <Controller
                      name="bride_dob"
                      control={control}
                      rules={{ required: 'Date of birth is required' }}
                      render={({ field, fieldState }) => (
                        <CustomDatePicker field={field} fieldState={fieldState} />
                      )}
                    />
                    {error.bride_dob && <span className='text-red-500 text-sm '>{error.bride_dob.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_pob" className='text-start'>Place of Birth: </label>
                    <input type="text" id='bride_pob' className='border rounded-md p-2 outline-none' 
                      {...register('bride_pob', {
                        required: `Place of birth is required`
                      })}
                    />
                    {error.bride_pob && <span className='text-red-500 text-sm '>{error.bride_pob.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_age" className='text-start'>Age: </label>
                    <input type="number" id='bride_age' className='border rounded-md p-2 outline-none' 
                      {...register('bride_age', {
                        required: `Age is required`
                      })}
                    />
                    {error.bride_age && <span className='text-red-500 text-sm '>{error.bride_age.message}</span>}
                  </div>
     
                 
                  <div className='flex flex-col'>
                    <label htmlFor="bride_occupation" className='text-start'>Occupation: </label>
                    <input type="text" id='bride_occupation' className='border rounded-md p-2 outline-none' 
                      {...register('bride_occupation', {
                        required: `Occupation is required`
                      })}
                    />
                    {error.bride_occupation && <span className='text-red-500 text-sm '>{error.bride_occupation.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_religion" className='text-start'>Religion: </label>
                    <input type="text" id='bride_religion' className='border rounded-md p-2 outline-none' 
                      {...register('bride_religion', {
                        required: `Religion is required`
                      })}
                    />
                    {error.bride_religion && <span className='text-red-500 text-sm '>{error.bride_religion.message}</span>}
                  </div>
                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GROOM'S PARENT INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="groom_father_name" className='text-start'>Father's Name: </label>
                    <input type="text" id='groom_father_name' className='border rounded-md p-2 outline-none' 
                      {...register('groom_father_name', {
                        required: `Father's name is required`
                      })}
                    />
                    {error.groom_father_name && <span className='text-red-500 text-sm '>{error.groom_father_name.message}</span>}
                  </div>


                  <div className='flex flex-col'>
                    <label htmlFor="groom_mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='groom_mother_name' className='border rounded-md p-2 outline-none' 
                      {...register('groom_mother_name', {
                        required: `Mother's name is required`
                      })}
                    />
                    {error.groom_mother_name && <span className='text-red-500 text-sm '>{error.groom_mother_name.message}</span>}
                  </div>


                  <div className='flex flex-col'>
                    <label htmlFor="groom_parent_religion" className='text-start'>Religion: </label>
                    <input type="text" id='groom_parent_religion' className='border rounded-md p-2 outline-none' 
                      {...register('groom_parent_religion', {
                        required: `Religion is required`
                      })}
                    />
                    {error.groom_parent_religion && <span className='text-red-500 text-sm '>{error.groom_parent_religion.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_parent_address" className='text-start'>Address: </label>
                    <input type="text" id='groom_parent_address' className='border rounded-md p-2 outline-none' 
                      {...register('groom_parent_address', {
                        required: `Religion is required`
                      })}
                    />
                    {error.groom_parent_address && <span className='text-red-500 text-sm '>{error.groom_parent_address.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="groom_parent_contact" className='text-start'>Contact No: </label>
                    <input type="text" id='groom_parent_contact' className='border rounded-md p-2 outline-none' 
                      {...register('groom_parent_contact', {
                        required: `Contact is required`
                      })}
                    />
                    {error.groom_parent_contact && <span className='text-red-500 text-sm '>{error.groom_parent_contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>BRIDE'S PARENTS INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_father_name" className='text-start'>Father's Name: </label>
                    <input type="text" id='bride_father_name' className='border rounded-md p-2 outline-none' 
                      {...register('bride_father_name', {
                        required: `Father's Name is required`
                      })}
                    />
                    {error.bride_father_name && <span className='text-red-500 text-sm '>{error.bride_father_name.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_mother_name" className='text-start'>Mother's Name: </label>
                    <input type="text" id='bride_mother_name' className='border rounded-md p-2 outline-none' 
                      {...register('bride_mother_name', {
                        required: `Mother's Name is required`
                      })}
                    />
                    {error.bride_mother_name && <span className='text-red-500 text-sm '>{error.bride_mother_name.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_parent_religion" className='text-start'>Religion: </label>
                    <input type="text" id='bride_parent_religion' className='border rounded-md p-2 outline-none' 
                      {...register('bride_parent_religion', {
                        required: `Religion is required`
                      })}
                    />
                    {error.bride_parent_religion && <span className='text-red-500 text-sm '>{error.bride_parent_religion.message}</span>}
                  </div>

                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_parent_address" className='text-start'>Address: </label>
                    <input type="text" id='bride_parent_address' className='border rounded-md p-2 outline-none' 
                      {...register('bride_parent_address', {
                        required: `Religion is required`
                      })}
                    />
                    {error.bride_parent_address && <span className='text-red-500 text-sm '>{error.bride_parent_address.message}</span>}
                  </div>
     
                  
                  <div className='flex flex-col'>
                    <label htmlFor="bride_parent_contact" className='text-start'>Contact No: </label>
                    <input type="text" id='bride_parent_contact' className='border rounded-md p-2 outline-none' 
                      {...register('bride_parent_contact', {
                        required: `Contact No is required`
                      })}
                    />
                    {error.bride_parent_contact && <span className='text-red-500 text-sm '>{error.bride_parent_contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>

                  <div className='flex flex-col'>
                    <label htmlFor="banns" className='text-start'>Banns: </label>
                    <input type="text" id='banns' className='border rounded-md p-2 outline-none' 
                      {...register('banns', {
                        required: `Contact No is required`
                      })}
                    />
                  </div>
                  
                  <div className='flex flex-col'>
                    <label htmlFor="license" className='text-start'>License: </label>
                    <input type="text" id='license' className='border rounded-md p-2 outline-none' 
                      {...register('license', {
                        required: `Contact No is required`
                      })}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label htmlFor="organist" className='text-start'>Organist: </label>
                    <input type="text" id='organist' className='border rounded-md p-2 outline-none' 
                      {...register('organist', {
                        required: `Contact No is required`
                      })}
                    />
                  </div>
     
                  <div className='flex flex-col'>
                    <label htmlFor="flowers" className='text-start'>Flowers: </label>
                    <input type="text" id='flowers' className='border rounded-md p-2 outline-none' 
                      {...register('flowers', {
                        required: `Contact No is required`
                      })}
                    />
                  </div>

                </div>
              </div>
        
              {/* <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
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

                <div className="flex flex-col items-center justify-center">
                  <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS:</h1>
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


              </div> */}
              <div className='w-full flex flex-col md:flex-row items-center justify-center gap-2'>
                <div className='border-2 border-black/30 p-2 rounded-lg'>
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
                <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col justify-center items-center'>
                  <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS</h1>
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
                    {files.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <div className="text-sm">{file.name}</div>
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
                
              </div>


            </div>

            <div className='my-5 flex justify-center items-center'>
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

    {showRehearsalModal && <RehearsalDateTime 
                                  setShowRehearsalModal={setShowRehearsalModal} 
                                  rehearsalSelectedDate={rehearsalSelectedDate}
                                  setRehearsalSelectedDate={setRehearsalSelectedDate}
                                  rehearsalSelectedTime={rehearsalSelectedTime}
                                  setRehearsalSelectedTime={setRehearsalSelectedTime}
                                  setRehearsalFullyBooked={setRehearsalFullyBooked}
                                  church_id={church?.id}
                                  />}

    {showWeddingModal && <WeddingDateTime 
                                  setShowWeddingModal={setShowWeddingModal} 
                                  weddingSelectedDate={weddingSelectedDate}
                                  setWeddingSelectedDate={setWeddingSelectedDate}
                                  weddingSelectedTime={weddingSelectedTime}
                                  setWeddingSelectedTime={setWeddingSelectedTime}
                                  setWeddingFullyBooked={setWeddingFullyBooked}
                                  church_id={church?.id}
                                  />}

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

export default Wedding
