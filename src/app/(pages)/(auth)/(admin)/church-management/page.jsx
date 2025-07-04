'use client'
import React, { useEffect, useState } from 'react'
import AdminLayout from '@/app/components/Layout/AdminLayout'

import { useAuthAdmin } from '@/app/hooks/authadmin'
import { NewUserModal } from '../components/NewUserModal'
import { EditUserModal } from '../components/EditUserModal'
import { useChurch } from '@/app/hooks/church'

import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

function UserManagement() {


  const route = useRouter()

  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [editUser, setEditUser] = useState(null) 
  const [loading, setLoading] = useState(false)

  const { allAdmin, deleteAdmin, admin, updateAdmin } = useAuthAdmin({})

  const { church } = useChurch({})

  const handleDeleteUser = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete ${item.fullname}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform delete logic here (e.g., API call)
        // console.log('Deleting user:', item);
        deleteAdmin({
          id: item.id
        })

        // Swal.fire({
        //   title: 'Deleted!',
        //   text: `${item.fullname} has been deleted.`,
        //   icon: 'success',
        //   timer: 1500,
        //   showConfirmButton: false,
        // });
      }
    });
  };

  // useEffect(() => {
  //   if(admin?.admin_type !== "Super Admin"){
  //     route.push('/dashboard-admin')
  //   }
  // }, [admin])


  const handleUpdateUser = (id, updatedData) => {


    if(editUser.fullname === updatedData.fullname && editUser.email === updatedData.email){
      setEditUser(null)
      Swal.fire({
        title: "Warning",
        text: "You must update at least one field before saving.",
        icon: "warning"
      });
      return 
    }

    setLoading(true)
    updateAdmin({
      id: id, 
      fullname: updatedData.fullname,
      email: updatedData.email,
      setEditUser,
      setLoading
    })

  }

  return (
    <>
    {admin?.admin_type === "Super Admin" ? (
      <>
    <AdminLayout>
        <div className='flex flex-col gap-5'>
          <h1 className='josefin-regular font-bold text-center text-2xl'>Admin Management</h1>
        </div>

        <div className='mt-5 flex justify-center items-center md:justify-end'>
          <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm md:text-base cursor-pointer' onClick={() => setShowNewUserModal(true)}>
            Add User
          </button>
        </div>

        {/* Table Wrapper for Responsiveness */}
        <div className="overflow-x-auto mt-5">
          <table className="min-w-full text-sm text-left border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Church Name</th>
                <th className="px-6 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allAdmin?.map((item, i) => {
                return(
                  <tr className='bg-white hover:bg-gray-50' key={i}>
                    <td className="px-6 py-4 border-b font-medium">{item.fullname}</td>
                    <td className="px-6 py-4 border-b">{item.church.church_name}</td>
                    <td className="px-6 py-4 border-b text-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded mr-2"
                        onClick={() => setEditUser(item)}
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded cursor-pointer" onClick={()=>handleDeleteUser(item)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </AdminLayout>

      {showNewUserModal && (
        <NewUserModal churches={church} setShowNewUserModal={setShowNewUserModal} />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleUpdateUser}
          loading={loading}
        />
      )}
      </>
    ) : (
      <>
      <div className='flex justify-center items-center'>
        This page is for CBCP Only
      </div>
      
      </>
    )}
    </>
  )
}

export default UserManagement
