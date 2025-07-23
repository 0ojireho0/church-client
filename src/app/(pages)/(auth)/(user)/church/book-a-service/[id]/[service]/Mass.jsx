'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'

// Components
import { MoonLoader } from 'react-spinners'
import RowRadioButtonsGroup from '@/app/components/RowRadioButtonsGroup'
import CustomDateTimePicker from '@/app/components/CustomDateTimePicker'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import CustomDatePicker from '@/app/components/CustomDatePicker'


// Hooks
import { useBook } from '@/app/hooks/book'

function Mass({church, user, allChurch}) {

  const { register, handleSubmit, reset, formState: {errors: error}, setValue, getValues } = useForm()
  const { massBook } = useBook({})

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)
  const [selectService, setSelectService] = useState()

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

  const services = [
    {
      value: "thanksgiving",
      label: "Thanksgiving"
    },
    {
      value: "special",
      label: "Special Intentions / Good Health / Safe Travel etc."
    },
    {
      value: "pass",
      label: "To Pass the exam / Interview etc."
    },
    {
      value: "healing",
      label: "Healing / Fast Recovery"
    },
    {
      value: "all",
      label: "All for the souls"
    }
  ]


  useEffect(() => {
    if(selectService){
      setValue('service', selectService)
    }
  }, [selectService])




  const handleSubmitMass = (data) => {

    if(!selectedDate || !selectedTime ){
      Swal.fire({
        title: "Error",
        text: "Select Booking Date",
        icon: "warning"
      })
      return
    }

    // if(files.length <= 0){
    //   Swal.fire({
    //     title: "Error",
    //     text: "Upload File is required",
    //     icon: "warning"
    //   })
    //   return
    // }

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

    massBook({
      formData,
      reset,
      setLoading,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime,
      setSelectService,
      setShowOnlinePaymentModal,
      setLoadingDone,
      setFiles
    })
  }

  const handleDoneSubmit = () => {
    setLoadingDone(true)

  if (files?.length > 0) {
    files.forEach((file) => {
      passData.append('files[]', file);
    });
  }

    massBook({
      formData: passData,
      reset,
      setLoading,
      setSelectedPayment,
      setSelectedDate,
      setSelectedTime,
      setSelectService,
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

  useEffect(() => {
    const getMassForm = JSON.parse(localStorage.getItem('mass_form'))

    if (!getMassForm) {
      // console.log("wala") // No saved form
    } else {
      // console.log("meron", getBaptismForm) // Restore the form
      reset(getMassForm)

      // Restore other selections manually
      if (getMassForm.selectedPayment) setSelectedPayment(getMassForm.selectedPayment)
      if (getMassForm.service) setSelectService(getMassForm.service)

    }
  }, [reset])

  const handleBackBtn = () => {
    localStorage.removeItem('mass_form')
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

    localStorage.setItem("mass_form", JSON.stringify(fullData))
    localStorage.setItem("recommended_church", JSON.stringify(recommended))

    router.push('/church/recommended-church/mass')
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
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3 '>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Mass Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <form onSubmit={handleSubmit(handleSubmitMass)}>
          <div className='flex justify-center items-center my-2'>
            <CustomDateTimePicker 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
              selectedTime={selectedTime} 
              setSelectedTime={setSelectedTime} 
              setFullyBooked={setFullyBooked}
              church_id={church?.id}
              />
          </div>
          <div className='flex flex-col md:flex-row justify-between items-start gap-3 md:px-10 lg:px-24 xl:px-42 pb-5'>
            <div className='border p-2 rounded-lg'>
              <h1 className='font-bold josefin-regular text-center'>PERSONAL INFORMATION</h1>
              <div className='grid md:grid-cols-2 gap-3 items-center'>
                  <label htmlFor="fullname" className='md:text-end'>Full Name: </label>
                  <div>
                    <input type="text" 
                      id='fullname'
                      className='border outline-none p-2 w-full rounded-lg '
                      {...register('fullname', {
                        required: "Fullname is required",
                        value: user?.name
                      })} 
                      // value={user?.name}
                      />
                    {error?.fullname && <h1 className='text-red-700 font-semibold text-sm'>{error?.fullname?.message}</h1>}
                  </div>
              </div>
              <div className='mt-5'>
                {/* <div className="flex flex-col items-center">
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
                </div> */}
              {/* {files.length > 0 && (
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
              )} */}
              </div>
            </div>
            <div className='border p-2 rounded-lg'>
              <h1 className='font-bold josefin-regular text-center'>SERVICES</h1>
              <div className='flex flex-col gap-2'>
                <RowRadioButtonsGroup 
                    name="services"
                    value={selectService}
                    onChange={(e) => setSelectService(e.target.value)}
                    options={services}
                    row={false}
                />

              </div>
            </div>
            <div className='border p-2 rounded-lg'>
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

    {showOnlinePaymentModal && (
      <>
      <div className='fixed inset-0 bg-black/50 flex justify-center items-center px-2 z-[1000] '>
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
          <h1 className='text-sm josefin-regular font-bold mt-3'>2. Upload your Proof of Payment below by clicking the "Upload File" button. </h1>
          {/* <h1 className='text-sm josefin-regular text-center'>quiapochurch@gmail.com</h1> */}
          <h1 className='text-sm josefin-regular font-bold mt-3'>3. Wait for our confirmation email within 24 hours upon submitting your application/request form. (If you did not receive a confirmation email, please contact us at churchconnect05@gmail.com) </h1>
          <div className="flex flex-col items-center my-3">
              <h1 className="font-bold josefin-regular text-center">Upload Proof of Payment</h1>
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

export default Mass
