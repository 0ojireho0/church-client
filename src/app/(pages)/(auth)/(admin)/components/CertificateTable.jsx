import React, {useState, useEffect, useRef} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from "primereact/dropdown";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from "primereact/calendar";
import { Message } from 'primereact/message';
import { Tooltip } from 'primereact/tooltip';
import { useAdminBook } from '@/app/hooks/adminBook'
import { InputTextarea } from "primereact/inputtextarea";
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";
import { FileUpload } from "primereact/fileupload";

import { useForm, set } from "react-hook-form";

import { useCertificate } from "@/app/hooks/certificate";

import Swal from "sweetalert2";

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function CertificateTable({searchStatus, church_id}) {

    const [showCertModal, setShowCertModal] = useState(false)
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const dt = useRef(null);
    const [selectedCert, setSelectedCert] = useState(null)
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedViewForm, setSelectedViewForm] = useState([])
    const [showViewForm, setShowViewForm] = useState(false)
    


    const { register, handleSubmit, formState: {errors}, watch, reset, setValue  } = useForm()

    const { addNewCertificate, certificate } = useCertificate({
        searchStatus
    })

    const showAddCertModal = () => {
        setShowCertModal(true)
    }


    const rightToolbarTemplate = () => {
      return(
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-plus-circle" rounded label="Add Certificate" onClick={showAddCertModal} />
        </div>
      )
    };

    const onHideAddCert = () => {
        // setFormData([])
        setShowCertModal(false)
        reset()
        setFiles([])
        
    }

    const certModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideAddCert} />
        </React.Fragment>
    )
    
    const submitCreateCert = (data) => {
        // console.log(data, church_id)

        const formData = new FormData()
        formData.append('church_id', church_id)
        formData.append('fullname', data.fullname)
        formData.append('dob', dayjs(data.dob).format('YYYY-MM-DD'))
        formData.append('cert_type', data.cert_type)

        data.files.forEach((file, index) => {
            formData.append(`files[]`, file)
        })

        setLoading(true)
        addNewCertificate({
            formData,
            reset,
            setLoading,
            setShowCertModal,
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
  
      const updatedFiles = [...files, ...filteredFiles];
      setFiles(updatedFiles);
      setValue("files", updatedFiles, { shouldValidate: true });
    }

    useEffect(() => {
        register("files", {
            required: "File is required"
        });
    }, [register]);

    const handleFileDelete = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        setValue("files", updatedFiles, { shouldValidate: true }); // <-- sync with react-hook-form
    };
    
    const certificates = [
        {name: 'Baptism', code: "Baptism"},
        {name: 'Wedding', code: "Wedding"},
        {name: 'Confirmation', code: "Confirmation"}
    ]

    const header = (
    <div className="flex flex-col md:flex-row items-center justify-between">
        <h4 className="m-0">
            {searchStatus === 0 && "All Certificates"}
            {searchStatus === 1 && "Baptismal Certificates"}
            {searchStatus === 2 && "Wedding Certificates"}
            {searchStatus === 3 && "Confirmation Certificates"}
            
            </h4>
        <div className="flex flex-col md:flex-row gap-3">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    </div>
    );

    const dateCreatedTemplate = (rowData) => {
        return(
            <>
            <h1>{dayjs(rowData.created_at).format('MMMM DD, YYYY hh:mm A')}</h1>

            </>
        )
        
    }

    const viewForm = (data) => {
        setSelectedViewForm(data)
        setShowViewForm(true)

    }

    const viewBodyTemplate = (rowData) => {
        return (   
            <React.Fragment>
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => viewForm(rowData)} />
            </React.Fragment>
        )
    }

    const onHideViewForm = () => {
        setShowViewForm(false)
        // setSelectedViewForm([])
        
    }

    const viewFormFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideViewForm} />
        </React.Fragment>
    )

  return (
    <>
    <div>
        <div className="card">
            <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
            <DataTable 
                ref={dt} 
                value={certificate} 
                selection={selectedCert} 
                onSelectionChange={(e) => setSelectedCert(e.value)}   
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter}
                header={header}
                removableSort
            >
                <Column field="id" header="Id" sortable style={{minWidth: '10rem'}} ></Column>
                <Column field="church.church_name" header="Church" sortable style={{minWidth: '10rem'}} ></Column>
                <Column field="fullname" header="Name" sortable style={{minWidth: '10rem'}}></Column>
                <Column body={dateCreatedTemplate} header="Date Created" style={{minWidth: '10rem'}}></Column>
                <Column field={`cert_type`} header="Certificate Type" sortable></Column>
                <Column header="View" body={viewBodyTemplate} exportable={false} style={{minWidth: '12rem'}} ></Column>
            </DataTable>
        </div>

        <Dialog 
            visible={showCertModal} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header={`Add new Certificate`}
            modal
            className="p-fluid"
            footer={certModalFooter}
            onHide={onHideAddCert}
            draggable={false}
        >

        <h1 className="font-bold josefin-regular">Certificate Information</h1>
        <form onSubmit={handleSubmit(submitCreateCert)}>
            <div className="field mt-5">
                <label htmlFor="fullname" className="font-bold">Fullname</label>
                <InputText 
                    {...register('fullname', {
                        required: "Fullname is Required"
                    })} 
                    id="fullname"
                />
                {errors?.fullname && <h1 className="text-red-600 text-sm font-semibold">{errors?.fullname?.message}</h1>}
            </div>

            <div className="field">
                <label htmlFor="dob" className="font-bold">Date of Birth</label>
                <Calendar 
                    {...register('dob', {
                        required: "Date of Birth is Required"
                    })} 
                    value={watch('dob')} 
                    id="dob"
                    />
                {errors?.dob && <h1 className="text-red-600 text-sm font-semibold">{errors?.dob?.message}</h1>}
            </div>

            <div className="field">
                <label htmlFor="cert_type" className="font-bold">Certificate Type</label>
                <Dropdown 
                    options={certificates}
                    optionLabel="name"
                    optionValue="code"
                    placeholder="Select a Certificate Type"
                    {...register('cert_type', {
                        required: "Certificate Type is required"
                    })}
                    value={watch('cert_type')}
                />
                {errors?.cert_type && <h1 className="text-red-600 text-sm font-semibold">{errors?.cert_type?.message}</h1>}
            </div>

            <div className="field flex flex-col mt-3">
                <label htmlFor="" className="font-bold">Upload Certificate File</label>
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-center"
                >
                    Upload File
                </label>
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    // multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
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
                {errors?.files && <h1 className="text-red-600 text-sm font-semibold">{errors?.files?.message}</h1>}
            </div>

            <div className="field mt-3">
                {loading ? (
                    <>
                        <h1 className="flex justify-center items-center w-full bg-blue-400 hover:bg-blue-500 cursor-pointer py-2">
                            <MoonLoader size={25} />
                        </h1>
                    </>
                ) : (
                    <>
                        <Button label="Submit" type="submit" />
                    </>
                )}
            </div>


        </form>

        </Dialog>

        <Dialog
            visible={showViewForm}
            style={{width: '32rem'}}
            breakpoints={{'960px': '75vw', '641px': '90vw'}}
            header={`${selectedViewForm?.fullname}`}
            modal
            className="p-fluid"
            footer={viewFormFooter}
            onHide={onHideViewForm}
            draggable={false}
        >

            <h1 className="font-bold josefin-regular">Certificate Information</h1>

            <div className="field mt-5">
                <label className="font-bold">Uploaded by (Church)</label>
                <InputText 
                    value={selectedViewForm?.church?.church_name}
                    disabled
                />
            </div>

            <div className="field">
                <label className="font-bold">Fullname</label>
                <InputText 
                    value={selectedViewForm?.fullname}
                    disabled
                />
            </div>

            <div className="field">
                <label className="font-bold">Date of Birth</label>
                <InputText 
                    value={dayjs(selectedViewForm?.dob).format('MMMM D, YYYY')}
                    disabled
                />
            </div>

            <div className="field">
                <label className="font-bold">Certificate Type</label>
                <InputText 
                    value={selectedViewForm?.cert_type + " " + "Certificate"}
                    disabled
                />
            </div>

            <div className="field flex flex-col" >
                <label className="font-bold">Certificate File</label>
                <a 
                    className="text-blue-500 hover:text-blue-600 underline"
                    href={selectedViewForm?.filepath} target="_blank">{selectedViewForm?.filename}
                </a>
            </div>

            
        </Dialog>



    </div>
    
    
    </>
  )
}

export default CertificateTable
