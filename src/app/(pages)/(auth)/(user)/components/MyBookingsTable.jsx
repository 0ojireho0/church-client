import React, {useState, useEffect, useRef} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dialog } from "primereact/dialog";
import { Tooltip } from 'primereact/tooltip';
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { useUser } from "@/app/hooks/user";
import Swal from "sweetalert2";


function MyBookingsTable({user_id}) {

    const [selectedBookings, setSelectedBookings] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [formData, setFormData] = useState([])
    const [showViewBaptism, setShowViewBaptism] = useState(false)
    const [showViewWedding, setShowViewWedding] = useState(false)
    const [showViewMemorial, setShowViewMemorial] = useState(false)
    const [showViewConfirmation, setShowViewConfirmation] = useState(false)
    const [showViewMass, setShowViewMass] = useState(false)
    const [showViewCertificate, setShowViewCertificate] = useState(false)
    const [loader, setLoader] = useState(false)
    const dt = useRef(null);


    const includeStatus = ['Approved', 'Rejected']

    const { myBooks, cancelBookingData } = useUser({
        user_id: user_id
    })

    const header = (
    <div className="flex flex-col md:flex-row items-center justify-between">
        <h4 className="m-0">
            My Bookings
        </h4>
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </IconField>
    </div>
    );

    const statusBody = (rowData) => {
        return (
            <>
            <span className={`
                ${rowData.status === "Approved" ? "bg-green-600" 
                    : rowData.status === "Rejected" ? "bg-red-600" 
                    : rowData.status === "Pending" ? "bg-yellow-600"
                    : "bg-rose-600"
                }
                px-4 py-2 text-white rounded-lg
                `}>
                {rowData.status}
            </span>
            
            </>
        )
    }

    const viewForm = (data) => {
        setFormData(data)
        if(data.service_type == "baptism"){
            setShowViewBaptism(true)
        } else if(data.service_type == "wedding"){
            setShowViewWedding(true)
        } else if(data.service_type == "memorial"){
            setShowViewMemorial(true)
        } else if(data.service_type == "confirmation"){
            setShowViewConfirmation(true)
        }else if(data.service_type == "certificate"){
            setShowViewCertificate(true)
        }else{
            setShowViewMass(true)
        }
    }

    const actionBodyTemplate = (rowData) => {
        return(
            <>
            <Button icon="pi pi-eye" rounded outlined onClick={() => viewForm(rowData)} />
            
            </>
        )
    }

    const onHideBaptism = () => {
        // setFormData([])
        setShowViewBaptism(false)
    }

    const cancelBooking = (data, show) => {
        show(false)
        Swal.fire({
            title: "Are you sure you want to Cancel your Booking?",
            text: "Do you really want to cancel?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#e53e3e',
            cancelButtonColor: '#a0aec0',
            confirmButtonText: 'Yes, cancel it!',
        }).then((result) => {
            if(result.isConfirmed){

                show(true)
                setLoader(true)
                cancelBookingData({
                    booking_id: data.id,
                    setLoader,
                    show
                })
            }
        })
    }

    const baptismModalFooter = () => {
        return(
            <React.Fragment>
                {loader ? (
                    <Button label="Cancel Book" severity="danger" icon="pi pi-spin pi-spinner" />
                ) : (
                    <>
                        {!includeStatus.includes(formData?.status) && (
                            <>
                                <Button label="Cancel Book" severity="danger" icon="pi pi-times" onClick={() => cancelBooking(formData, setShowViewBaptism)} />
                            </>
                        )}
                    </>
                )}

            </React.Fragment>
        )
    }

    const onHideWedding = () => {
        // setFormData([])
        setShowViewWedding(false)
    }

    const weddingModalFooter = (
        <React.Fragment>
            {loader ? (
                <Button label="Cancel Book" severity="danger" icon="pi pi-spin pi-spinner" />
            ) : (
                    <>
                        {!includeStatus.includes(formData?.status) && (
                            <>
                                <Button label="Cancel Book" severity="danger" icon="pi pi-times" onClick={() => cancelBooking(formData, setShowViewWedding)} />
                            </>
                        )}
                    </>
            )}
        </React.Fragment>
    )

    const onHideMemorial = () => {
        // setFormData([])
        setShowViewMemorial(false)
    }

    const memorialModalFooter = (
        <React.Fragment>
            {loader ? (
                <Button label="Cancel Book" severity="danger" icon="pi pi-spin pi-spinner" />
            ) : (
                <>
                    {!includeStatus.includes(formData?.status) && (
                        <>
                            <Button label="Cancel Book" severity="danger" icon="pi pi-times" onClick={() => cancelBooking(formData, setShowViewMemorial)} />
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    )

    const onHideConfirmation = () => {
        // setFormData([])
        setShowViewConfirmation(false)
    }

    const confirmationModalFooter = (
        <React.Fragment>
            {loader ? (
                <Button label="Cancel Book" severity="danger" icon="pi pi-spin pi-spinner" />
            ) : (
                <>
                    {!includeStatus.includes(formData?.status) && (
                        <>
                            <Button label="Cancel Book" severity="danger" icon="pi pi-times" onClick={() => cancelBooking(formData, setShowViewConfirmation)} />
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    )

    const onHideMass = () => {
        // setFormData([])
        setShowViewMass(false)
    }

    const massModalFooter = (
        <React.Fragment>
            {loader ? (
                <Button label="Cancel Book" severity="danger" icon="pi pi-spin pi-spinner" />
            ) : (
                <>
                    {!includeStatus.includes(formData?.status) && (
                        <>
                            <Button label="Cancel Book" severity="danger" icon="pi pi-times" onClick={() => cancelBooking(formData, setShowViewMass)} />
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    )

    const onHideCertificate = () => {
        // setFormData([])
        setShowViewCertificate(false)
    }

    const certificateModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideCertificate} />
        </React.Fragment>
    )


  return (
    <>
        {myBooks ? (
            <>
            <div className="card">
                {/* <Toolbar className="mb-4" end={rightToolbarTemplate}  ></Toolbar> */}
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable ref={dt} value={myBooks} selection={selectedBookings} onSelectionChange={(e) => setSelectedBookings(e.value)} 
                            dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header} removableSort
                    >
                        {/* <Column></Column> */}
                        <Column field="id" header="Id" sortable style={{minWidth: '10rem'}} ></Column>
                        <Column field="reference_num" header="Reference No." sortable style={{minWidth: '12rem'}}   ></Column>
                        <Column 
                            body={(rowData) => {
                                if (!rowData.date || !rowData.time_slot) {
                                    const date = dayjs(rowData.created_at).format('MMMM DD, YYYY hh:mm A')
                                    return `${date}`;
                                }
                                const date = dayjs(rowData.date).format('MMMM DD, YYYY');
                                const time = dayjs(`${date} ${rowData.time_slot}`, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A');
                                return `${date} ${time}`;
                            }}
                            sortable 
                            header="Date & Time"
                            style={{minWidth: '10rem'}} ></Column>
                        <Column field="service_type" header="Service Type" sortable style={{minWidth: '10rem'}}></Column>
                        <Column field="mop" header="Mode of Payment" sortable style={{minWidth: '12rem'}} ></Column>
                        <Column field="status" body={statusBody} header="Status" sortable style={{minWidth: '12rem'}} ></Column>
                        <Column body={actionBodyTemplate} header="Action" />
                    </DataTable>
            </div>

        <Dialog 
        visible={showViewBaptism} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Baptism Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={
            formData?.status != "Cancelled" && baptismModalFooter
        
        }
        onHide={onHideBaptism}
        draggable={false}
        >
        <div className="field">
            <label htmlFor="fullname" className="font-bold">Full Name</label>
            <InputText disabled id="fullname" value={formData?.form_data?.fullname} />
        </div>

        <div className="field">
            <label htmlFor="dob" className="font-bold">Date of Birth</label>
            <InputText disabled id="dob" value={new Date(formData?.form_data?.dob).toLocaleDateString()} />
        </div>

        <div className="field">
            <label htmlFor="gender" className="font-bold">Gender</label>
            <InputText disabled id="gender" value={formData?.form_data?.gender} />
        </div>

        <div className="field">
            <label htmlFor="pob" className="font-bold">Place of Birth</label>
            <InputText disabled id="pob" value={formData?.form_data?.pob} />
        </div>

        <div className="field">
            <label htmlFor="address" className="font-bold">Address</label>
            <InputText disabled id="address" value={formData?.form_data?.address} />
        </div>

        <div className="field">
            <label htmlFor="contact" className="font-bold">Contact Number</label>
            <InputText disabled id="contact" value={formData?.form_data?.contact} />
        </div>

        <div className="field">
            <label htmlFor="father" className="font-bold">Father's Name</label>
            <InputText disabled id="father" value={formData?.form_data?.father} />
        </div>

        <div className="field">
            <label htmlFor="mother" className="font-bold">Mother's Name</label>
            <InputText disabled id="mother" value={formData?.form_data?.mother} />
        </div>

        <div className="field">
            <label htmlFor="godfather" className="font-bold">Godfather</label>
            <InputText disabled id="godfather" value={formData?.form_data?.godfather} />
        </div>

        <div className="field">
            <label htmlFor="godmother" className="font-bold">Godmother</label>
            <InputText disabled id="godmother" value={formData?.form_data?.godmother} />
        </div>

        {formData?.files?.length > 0 && (
            <div className="field">
            <label className="font-bold">Uploaded Files</label>
            <ul className="list-disc ml-5">
                {formData.files.map((file, index) => (
                <li key={index}>
                    <a 
                    href={file.filepath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                    >
                    {file.filename}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        )}

        </Dialog>

        <Dialog 
        visible={showViewWedding} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Wedding Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={formData?.status != "Cancelled" && weddingModalFooter}
        onHide={onHideWedding}
        draggable={false}
        >
        {/* Groom Info */}
        <h4 className="mt-3 mb-2 font-bold">Groom Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="field"><label className="font-bold">Full Name</label><InputText disabled value={formData?.form_data?.groom_fullname} /></div>
            <div className="field"><label className="font-bold">Date of Birth</label><InputText disabled value={new Date(formData?.form_data?.groom_dob).toLocaleDateString()} /></div>
            <div className="field"><label className="font-bold">Age</label><InputText disabled value={formData?.form_data?.groom_age} /></div>
            <div className="field"><label className="font-bold">Place of Birth</label><InputText disabled value={formData?.form_data?.groom_pob} /></div>
            <div className="field"><label className="font-bold">Religion</label><InputText disabled value={formData?.form_data?.groom_religion} /></div>
            <div className="field"><label className="font-bold">Occupation</label><InputText disabled value={formData?.form_data?.groom_occupation} /></div>
            <div className="field"><label className="font-bold">Father's Name</label><InputText disabled value={formData?.form_data?.groom_father_name} /></div>
            <div className="field"><label className="font-bold">Mother's Name</label><InputText disabled value={formData?.form_data?.groom_mother_name} /></div>
            <div className="field"><label className="font-bold">Parent Address</label><InputText disabled value={formData?.form_data?.groom_parent_address} /></div>
            <div className="field"><label className="font-bold">Parent Contact</label><InputText disabled value={formData?.form_data?.groom_parent_contact} /></div>
            <div className="field"><label className="font-bold">Parent Religion</label><InputText disabled value={formData?.form_data?.groom_parent_religion} /></div>
        </div>

        {/* Bride Info */}
        <h4 className="mt-4 mb-2 font-bold">Bride Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="field"><label className="font-bold">Full Name</label><InputText disabled value={formData?.form_data?.bride_fullname} /></div>
            <div className="field"><label className="font-bold">Date of Birth</label><InputText disabled value={new Date(formData?.form_data?.bride_dob).toLocaleDateString()} /></div>
            <div className="field"><label className="font-bold">Age</label><InputText disabled value={formData?.form_data?.bride_age} /></div>
            <div className="field"><label className="font-bold">Place of Birth</label><InputText disabled value={formData?.form_data?.bride_pob} /></div>
            <div className="field"><label className="font-bold">Religion</label><InputText disabled value={formData?.form_data?.bride_religion} /></div>
            <div className="field"><label className="font-bold">Occupation</label><InputText disabled value={formData?.form_data?.bride_occupation} /></div>
            <div className="field"><label className="font-bold">Father's Name</label><InputText disabled value={formData?.form_data?.bride_father_name} /></div>
            <div className="field"><label className="font-bold">Mother's Name</label><InputText disabled value={formData?.form_data?.bride_mother_name} /></div>
            <div className="field"><label className="font-bold">Parent Address</label><InputText disabled value={formData?.form_data?.bride_parent_address} /></div>
            <div className="field"><label className="font-bold">Parent Contact</label><InputText disabled value={formData?.form_data?.bride_parent_contact} /></div>
            <div className="field"><label className="font-bold">Parent Religion</label><InputText disabled value={formData?.form_data?.bride_parent_religion} /></div>
        </div>

        {/* Other Info */}
        <h4 className="mt-4 mb-2 font-bold">Additional Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="field"><label className="font-bold">License</label><InputText disabled value={formData?.form_data?.license} /></div>
            <div className="field"><label className="font-bold">Banns</label><InputText disabled value={formData?.form_data?.banns} /></div>
            <div className="field"><label className="font-bold">Organist</label><InputText disabled value={formData?.form_data?.organist} /></div>
            <div className="field"><label className="font-bold">Flowers</label><InputText disabled value={formData?.form_data?.flowers} /></div>
        </div>

        {formData?.files?.length > 0 && (
            <div className="field">
            <label className="font-bold">Uploaded Files</label>
            <ul className="list-disc ml-5">
                {formData.files.map((file, index) => (
                <li key={index}>
                    <a 
                    href={file.filepath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                    >
                    {file.filename}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        )}
        </Dialog>

        <Dialog 
        visible={showViewMemorial} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Memorial Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={formData?.status != "Cancelled" && memorialModalFooter}
        onHide={onHideMemorial}
        draggable={false}
        >
        <div className="field">
            <label htmlFor="deceased_fullname" className="font-bold">Full Name of Deceased</label>
            <InputText disabled id="deceased_fullname" value={formData?.form_data?.deceased_fullname} />
        </div>

        <div className="field">
            <label htmlFor="deceased_dob" className="font-bold">Date of Birth</label>
            <InputText disabled id="deceased_dob" value={new Date(formData?.form_data?.deceased_dob).toLocaleDateString()} />
        </div>

        <div className="field">
            <label htmlFor="deceased_dod" className="font-bold">Date of Death</label>
            <InputText disabled id="deceased_dod" value={new Date(formData?.form_data?.deceased_dod).toLocaleDateString()} />
        </div>

        <div className="field">
            <label htmlFor="deceased_gender" className="font-bold">Gender</label>
            <InputText disabled id="deceased_gender" value={formData?.form_data?.deceased_gender} />
        </div>

        <div className="field">
            <label htmlFor="deceased_age" className="font-bold">Age</label>
            <InputText disabled id="deceased_age" value={formData?.form_data?.deceased_age} />
        </div>

        <div className="field">
            <label htmlFor="spouse_fullname" className="font-bold">Spouse Full Name</label>
            <InputText disabled id="spouse_fullname" value={formData?.form_data?.spouse_fullname} />
        </div>

        <div className="field">
            <label htmlFor="spouse_gender" className="font-bold">Spouse Gender</label>
            <InputText disabled id="spouse_gender" value={formData?.form_data?.spouse_gender} />
        </div>

        <div className="field">
            <label htmlFor="spouse_deceased" className="font-bold">Date of Spouse's Death</label>
            <InputText disabled id="spouse_deceased" value={new Date(formData?.form_data?.spouse_deceased).toLocaleDateString()} />
        </div>

        <div className="field">
            <label htmlFor="funeral_home_name" className="font-bold">Funeral Home Name</label>
            <InputText disabled id="funeral_home_name" value={formData?.form_data?.funeral_home_name} />
        </div>

        <div className="field">
            <label htmlFor="funeral_mailing_address" className="font-bold">Funeral Mailing Address</label>
            <InputText disabled id="funeral_mailing_address" value={formData?.form_data?.funeral_mailing_address} />
        </div>

        <div className="field">
            <label htmlFor="plot" className="font-bold">Plot Number</label>
            <InputText disabled id="plot" value={formData?.form_data?.plot} />
        </div>

        <div className="field">
            <label htmlFor="loc_plot" className="font-bold">Plot Location</label>
            <InputText disabled id="loc_plot" value={formData?.form_data?.loc_plot} />
        </div>

        <div className="field">
            <label htmlFor="losr" className="font-bold">Location of Spouse Remain</label>
            <InputText disabled id="losr" value={formData?.form_data?.losr} />
        </div>

        {formData?.files?.length > 0 && (
            <div className="field">
            <label className="font-bold">Uploaded Files</label>
            <ul className="list-disc ml-5">
                {formData.files.map((file, index) => (
                <li key={index}>
                    <a 
                    href={file.filepath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                    >
                    {file.filename}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        )}
        </Dialog>

        <Dialog 
        visible={showViewConfirmation} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Confirmation Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={formData?.status != "Cancelled" && confirmationModalFooter}
        onHide={onHideConfirmation}
        draggable={false}
        >
        <div className="field">
            <label htmlFor="fullname" className="font-bold">Full Name</label>
            <InputText disabled id="fullname" value={formData?.form_data?.fullname} />
        </div>

        <div className="field">
            <label htmlFor="dob" className="font-bold">Date of Birth</label>
            <InputText disabled id="dob" value={new Date(formData?.form_data?.dob).toLocaleDateString()} />
        </div>

        <div className="field">
            <label htmlFor="pob" className="font-bold">Place of Birth</label>
            <InputText disabled id="pob" value={formData?.form_data?.pob} />
        </div>

        <div className="field">
            <label htmlFor="father_name" className="font-bold">Father's Name</label>
            <InputText disabled id="father_name" value={formData?.form_data?.father_name} />
        </div>

        <div className="field">
            <label htmlFor="mother_name" className="font-bold">Mother's Name</label>
            <InputText disabled id="mother_name" value={formData?.form_data?.mother_name} />
        </div>

        <div className="field">
            <label htmlFor="contact" className="font-bold">Contact Number</label>
            <InputText disabled id="contact" value={formData?.form_data?.contact} />
        </div>

        <div className="field">
            <label htmlFor="purpose" className="font-bold">Purpose</label>
            <InputText disabled id="purpose" value={formData?.form_data?.purpose} />
        </div>

        {formData?.files?.length > 0 && (
            <div className="field">
            <label className="font-bold">Uploaded Files</label>
            <ul className="list-disc ml-5">
                {formData.files.map((file, index) => (
                <li key={index}>
                    <a 
                    href={file.filepath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                    >
                    {file.filename}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        )}
        </Dialog>

        <Dialog 
        visible={showViewMass} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Mass Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={formData?.status != "Cancelled" && massModalFooter}
        onHide={onHideMass}
        draggable={false}
        >
        <div className="field">
            <label htmlFor="fullname" className="font-bold">Full Name</label>
            <InputText disabled id="fullname" value={formData?.form_data?.fullname} />
        </div>

        <div className="field">
            <label htmlFor="service" className="font-bold">Type of Service</label>
            <InputText disabled id="service" 
                value={
                        formData?.form_data?.service == "thanksgiving" ? "Thanksgiving" :
                        formData?.form_data?.service == "special" ? "Special Intentions / Good Health / Safe Travel etc." :
                        formData?.form_data?.service == "pass" ? "To Pass the exam / Interview etc." : 
                        formData?.form_data?.service == "healing" ? "Healing / Fast Recovery" : 
                        formData?.form_data?.service == "all" ? "All for the souls" : "-"
                        } />
        </div>

        {formData?.files?.length > 0 && (
            <div className="field">
            <label className="font-bold">Uploaded Files</label>
            <ul className="list-disc ml-5">
                {formData.files.map((file, index) => (
                <li key={index}>
                    <a 
                    href={file.filepath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-words"
                    >
                    {file.filename}
                    </a>
                </li>
                ))}
            </ul>
            </div>
        )}
        </Dialog>

        <Dialog 
        visible={showViewCertificate} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Certificate Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={certificateModalFooter}
        onHide={onHideCertificate}
        draggable={false}
        >
        <div className="field">
            <label htmlFor="fullname" className="font-bold">Full Name</label>
            <InputText disabled id="fullname" value={formData?.form_data?.fullname} />
        </div>

        <div className="field">
            <label htmlFor="birthday" className="font-bold">Birthday</label>
            <InputText disabled id="birthday" value={formData?.form_data?.birthday} />
        </div>

        <div className="field">
            <label htmlFor="baptismDate" className="font-bold">Preferred Baptism Date</label>
            <InputText disabled id="baptismDate" value={formData?.form_data?.baptismDate} />
        </div>

        <div className="field">
            <label htmlFor="contact" className="font-bold">Contact Number</label>
            <InputText disabled id="contact" value={formData?.form_data?.contact} />
        </div>

        <div className="field">
            <label htmlFor="address" className="font-bold">Address</label>
            <InputText disabled id="address" value={formData?.form_data?.address} />
        </div>

        <div className="field">
            <label htmlFor="place" className="font-bold">Place of Baptism</label>
            <InputText disabled id="place" value={formData?.form_data?.place} />
        </div>

        <div className="field">
            <label htmlFor="father" className="font-bold">Father's Name</label>
            <InputText disabled id="father" value={formData?.form_data?.father} />
        </div>

        <div className="field">
            <label htmlFor="mother" className="font-bold">Mother's Name</label>
            <InputText disabled id="mother" value={formData?.form_data?.mother} />
        </div>

        <div className="field">
            <label htmlFor="services" className="font-bold">Requested Services</label>
            <InputTextarea 
                disabled 
                id="services" 
                value={formData?.form_data?.services?.join(', ')} 
                rows={2} 
            />
        </div>
        </Dialog>

            </>
        ) : (
            <>
                <div className="flex justify-center items-center">
                    <MoonLoader size={50} />
                </div>
            </>
        )}
    
    
    </>
  )
}

export default MyBookingsTable
