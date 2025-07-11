'use client'
import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import { useForm, Controller, get } from 'react-hook-form'
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




function Baptism({church, user, allChurch}) {

  const { register, handleSubmit, reset, formState: {errors: error}, control, getValues } = useForm()

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fullyBooked, setFullyBooked] = useState(null)

  const [showOnlinePaymentModal, setShowOnlinePaymentModal] = useState(false)
  const [passData, setPassData] = useState()
  const [loadingDone, setLoadingDone] = useState(false)

  const [files, setFiles] = useState([])

  const [loading, setLoading] = useState(false)

  const router = useRouter()
  

  const { baptismBook } = useBook({})


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


  const handleSubmitBaptism = (data) => {


  if (!selectedDate || !selectedTime) {
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

  // If online payment:
  if (selectedPayment === "online") {
    setPassData(formData)
    setShowOnlinePaymentModal(true)
    return
  }

  setLoading(true)

  baptismBook({
    formData,
    reset,
    setLoading,
    setSelectedPayment,
    setSelectedDate,
    setSelectedTime,
    setFullyBooked,
    setLoadingDone,
    setShowOnlinePaymentModal,
    setFiles
  })

    
  }

  const handleDoneSubmit = () => {
    setLoadingDone(true)
    baptismBook({
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


  useEffect(() => {
    const getBaptismForm = JSON.parse(localStorage.getItem('baptism_form'))

    if (!getBaptismForm) {
      // console.log("wala") // No saved form
    } else {
      // console.log("meron", getBaptismForm) // Restore the form
      reset(getBaptismForm)

      // Restore other selections manually
      if (getBaptismForm.selectedPayment) setSelectedPayment(getBaptismForm.selectedPayment)

    }
  }, [reset])

  const handleBackBtn = () => {
    localStorage.removeItem('baptism_form')
  }

  if(!church){
    return(
       <div className='flex justify-center items-center'>
            <MoonLoader />
        </div>
    )
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

    localStorage.setItem("baptism_form", JSON.stringify(fullData))
    localStorage.setItem("recommended_church", JSON.stringify(recommended))

    router.push('/church/recommended-church/baptism')
  }



  return (
    <>
    <div className='flex justify-center items-center p-2 md:px-14 lg:px-28'>
      <div className='bg-white w-full p-3 rounded-lg border border-black/30 shadow-md flex flex-col gap-3'>
        <div>
          <h1 className='text-center font-bold josefin-regular lg:text-2xl'>Baptism Application Form</h1>
          <h1 className='text-center josefin-regular'>Selected Church: <span className='font-bold'>{church?.church_name}</span></h1>
        </div>

        <div className='flex justify-center items-center flex-col gap-3'>
          <form onSubmit={handleSubmit(handleSubmitBaptism)}>
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
            <div className='grid gap-3 md:grid-cols-2 md:gap-10'>
              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PERSONAL INFORMATION OF THE CHILD</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="fullname" className='text-end'>Full Name: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='fullname' className='border rounded-md p-2 outline-none' 
                      {...register('fullname', {
                        required: 'Fullname is required'
                      })}
                    />
                    {error.fullname && <span className='text-red-500 text-sm '>{error.fullname.message}</span>}
                  </div>

                  <label htmlFor="gender" className='text-end'>Gender: </label>
                  <div className='flex flex-col'>
                    <select 
                      name="gender" 
                      id="gender" 
                      className='border rounded-md p-2 outline-none'
                      {...register('gender', {
                        required: 'Gender is required'
                      })}
                      >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {error.gender && <span className='text-red-500 text-sm '>{error.gender.message}</span>}
                  </div>

                  <label htmlFor="dob" className='text-end'>Date of Birth: </label>
                  <div className='flex flex-col'>
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
     
                  <label htmlFor="pob" className='text-end'>Place of Birth: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='pob' className='border rounded-md p-2 outline-none' 
                      {...register('pob', {
                        required: 'Place of Birth is required'
                      })}
                    />
                    {error.pob && <span className='text-red-500 text-sm '>{error.pob.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>PARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="father" className='text-end'>Father's Name: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='father' className='border rounded-md p-2 outline-none' 
                      {...register('father', {
                        required: `Father's name is required`
                      })}
                    />
                    {error.father && <span className='text-red-500 text-sm '>{error.father.message}</span>}
                  </div>

                  <label htmlFor="mother" className='text-end'>Mother's Name: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='mother' className='border rounded-md p-2 outline-none' 
                      {...register('mother', {
                        required: `Mother's name is required`
                      })}
                    />
                    {error.mother && <span className='text-red-500 text-sm '>{error.mother.message}</span>}
                  </div>

                  <label htmlFor="address" className='text-end'>Home Address: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='address' className='border rounded-md p-2 outline-none' 
                      {...register('address', {
                        required: `Address's name is required`
                      })}
                    />
                    {error.address && <span className='text-red-500 text-sm '>{error.address.message}</span>}
                  </div>
     
                  <label htmlFor="contact" className='text-end'>Contact #: </label>
                  <div className='flex flex-col'>
                    <input type="text" id='contact' className='border rounded-md p-2 outline-none' 
                      {...register('contact', {
                        required: `Contact's name is required`
                      })}
                    />
                    {error.contact && <span className='text-red-500 text-sm '>{error.contact.message}</span>}
                  </div>

                </div>
              </div>

              <div className='border-2 border-black/30 p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>GODPARENT'S INFORMATION</h1>
                <div className='grid grid-cols-2 justify-center items-center gap-2'>
                  <label htmlFor="godfather" className='text-end'>Godfather's Name: </label>
                  <div className='flex flex-col'>
                    <textarea type="text" id='godfather' className='border rounded-md p-2 outline-none' 
                      {...register('godfather', {
                        required: `Godfather's name is required`
                      })}
                    />
                    {error.godfather && <span className='text-red-500 text-sm '>{error.godfather.message}</span>}
                  </div>

                  <label htmlFor="godmother" className='text-end'>Godmother's Name: </label>
                  <div className='flex flex-col'>
                    <textarea type="text" id='godmother' className='border rounded-md p-2 outline-none' 
                      {...register('godmother', {
                        required: `Godmother's name is required`
                      })}
                    />
                    {error.godmother && <span className='text-red-500 text-sm '>{error.godmother.message}</span>}
                  </div>

                </div>
              </div>

              <div className=' p-2 rounded-lg flex flex-col gap-2 '>
                <h1 className='font-bold josefin-regular text-center'>REQUIREMENTS:</h1>
                <ul className='list-inside list-disc'>
                  <li>Birth Certificate from PSA (ORIGINAL AND PHOTOCOPY)</li>
                  <li>Marriage Contract</li>
                </ul>
                <div className="flex items-center">
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

export default Baptism
