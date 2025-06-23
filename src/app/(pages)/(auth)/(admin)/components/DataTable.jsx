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
import { Message } from 'primereact/message';
import { Tooltip } from 'primereact/tooltip';
import { useAdminBook } from '@/app/hooks/adminBook'
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';

export default function FileTable({searchStatus, church_id}){



    const [book, setBook] = useState([])
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [remarks, setRemarks] = useState("")

    const [showViewBaptism, setShowViewBaptism] = useState(false)
    const [showViewWedding, setShowViewWedding] = useState(false)
    const [showViewMemorial, setShowViewMemorial] = useState(false)
    const [showViewConfirmation, setShowViewConfirmation] = useState(false)
    const [showViewMass, setShowViewMass] = useState(false)
    const [formData, setFormData] = useState([])

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');


  const { servicetype, changeStatus } = useAdminBook({
    searchStatus: searchStatus,
    church_id: church_id
  })


    const cols = [
        { field: 'id', header: 'Id' },
        { field: 'reference_num', header: 'Reference No.' },
        { field: 'user.name', header: 'Name' },
        { field: 'date', header: 'Date' },
        { field: 'time_slot', header: 'Time' },
        { field: 'book_type', header: 'Type' },
        { field: 'status', header: 'Status' },
    ];

    const status = [
        {name: "Pending", code: 'Pending'},
        {name: "Approved", code: 'Approved'},
        {name: "Rejected", code: "Rejected"}
    ]
    
    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };


    const flatten = (obj, path = '') =>
        Object.entries(obj).reduce((acc, [key, value]) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                Object.assign(acc, flatten(value, fullPath));
            } else {
                acc[fullPath] = value;
            }
            return acc;
        }, {});
    
    const exportPdf = () => {
        const doc = new jsPDF();

        const body = servicetype.map((item) => {
            const flat = flatten(item);
            return exportColumns.reduce((row, col) => {
                row[col.dataKey] = flat[col.dataKey] || '';
                return row;
            }, {});
        });

        autoTable(doc, {
            head: [['ID', 'Reference No.', 'Name', 'Date', 'Time', 'Type', 'Status']],
            columns: exportColumns,
            body
        });

        if(searchStatus === 0){
            doc.save('all-service_' + now + '.pdf');
        }else if(searchStatus === 1){
            doc.save('baptism_' + now + '.pdf');
        
        }else if(searchStatus === 2){
            doc.save('wedding_' + now + '.pdf');
        }else if(searchStatus === 3){
            doc.save('memorial_' + now + '.pdf');
        }else if(searchStatus === 4){
            doc.save('confirmation_' + now + '.pdf');
        }else{
            doc.save('mass_' + now + '.pdf');
        }
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(servicetype);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'products');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };


    const rightToolbarTemplate = () => {
      return(
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
      )
    };

    const header = (
    <div className="flex flex-col md:flex-row items-center justify-between">
        <h4 className="m-0">
            {searchStatus === 0 && "All Request"}
            {searchStatus === 1 && "Baptismal Request"}
            {searchStatus === 2 && "Wedding Request"}
            {searchStatus === 3 && "Memorial Request"}
            {searchStatus === 4 && "Confirmation Request"}
            {searchStatus === 5 && "Mass Request"}
            {searchStatus === 6 && "Request Certificates"}
            
            </h4>
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </IconField>
    </div>
    );

    const editStatus = (data) => {
        setBook(data)
        setShowEditModal(true)
        setSelectedStatus(data.status)

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
        }else{
            setShowViewMass(true)
        }

        // console.log(data)
 
    }

    const actionBodyTemplate = (rowData) => {
        return(
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editStatus(rowData)} />
            </React.Fragment>
        )
    }

    const viewBodyTemplate = (rowData) => {
        return (   
            <React.Fragment>
                <Button icon="pi pi-eye" rounded outlined className="mr-2" onClick={() => viewForm(rowData)} />
            </React.Fragment>
        )
    }

    const hideDialog = () => {
        setError(false)
        setRemarks('')
        setShowEditModal(false)
    }

    const saveStatus = () => {

        if(book?.status === selectedStatus){
            setError(true)
            return
        }

        setLoading(true)
        changeStatus({
            id: book?.id,
            remarks,
            selectedStatus,
            setLoading,
            setShowEditModal,
            setRemarks
        })
    



    }

    const editModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} />
            <Button label="Save" loading={loading} icon="pi pi-check" onClick={saveStatus} />
        </React.Fragment>
    );

    const onHideBaptism = () => {
        // setFormData([])
        setShowViewBaptism(false)
    }

    const baptismModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideBaptism} />
        </React.Fragment>
    )

    const onHideWedding = () => {
        // setFormData([])
        setShowViewWedding(false)
    }

    const weddingModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideWedding} />
        </React.Fragment>
    )

    const onHideMemorial = () => {
        // setFormData([])
        setShowViewMemorial(false)
    }

    const memorialModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideMemorial} />
        </React.Fragment>
    )

    const onHideConfirmation = () => {
        // setFormData([])
        setShowViewConfirmation(false)
    }

    const confirmationModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideConfirmation} />
        </React.Fragment>
    )

    const onHideMass = () => {
        // setFormData([])
        setShowViewMass(false)
    }

    const massModalFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" onClick={onHideMass} />
        </React.Fragment>
    )
  
    const handleSelectStatus = (status) => {
        // console.log(status)
        setSelectedStatus(status)

        if(status !== book?.status){
            setError(false)
        }
    }

    const statusBody = (rowData) => {
        return (
            <>
            <span className={`
                ${rowData.status === "Approved" ? "bg-green-600" : rowData.status === "Rejected" ? "bg-red-600" : "bg-yellow-400"}
                px-4 py-2 text-white rounded-lg
                `}>
                {rowData.status}
            </span>
            
            </>
        )
    }

  return(
    <>
    <div className=''>
        {servicetype ? (
            <>
        <div className="card">
            <Toolbar className="mb-4" end={rightToolbarTemplate}  ></Toolbar>
            <Tooltip target=".export-buttons>button" position="bottom" />
            <DataTable ref={dt} value={servicetype} selection={selectedBooks} onSelectionChange={(e) => setSelectedBooks(e.value)} 
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header} removableSort    
            >
                {/* <Column></Column> */}
                <Column field="id" header="Id" sortable style={{minWidth: '10rem'}} ></Column>
                <Column field="reference_num" header="Reference No." sortable style={{minWidth: '12rem'}}   ></Column>
                <Column field="user.name" header="Name" sortable style={{minWidth: '12rem'}}  ></Column>
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
                <Column field="book_type" header="Type" sortable style={{minWidth: '12rem'}} ></Column>
                <Column field="service_type" header="Service Type" sortable style={{minWidth: '12rem'}} ></Column>
                <Column field="mop" header="Mode of Payment" sortable style={{minWidth: '12rem'}} ></Column>
                <Column field="status" body={statusBody} header="Status" sortable style={{minWidth: '12rem'}} ></Column>
                <Column header="View" body={viewBodyTemplate} exportable={false} style={{minWidth: '12rem'}} ></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </div>

        <Dialog 
            visible={showEditModal} 
            style={{ width: '32rem' }} 
            breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header="Set Status"
            modal
            className="p-fluid"
            footer={editModalFooter}
            onHide={hideDialog}
            draggable={false}
            >
            <div className="field">
                <label htmlFor="id" className="font-bold">Id</label>
                <InputText disabled id="id" value={book?.id} />
            </div>
            <div className="field">
                <label htmlFor="id" className="font-bold">Name</label>
                <InputText disabled id="id" value={book?.user?.name} />
            </div>
            <div className="field">
                <label htmlFor="ref_no" className="font-bold">Reference Number</label>
                <InputText disabled id="ref_no" value={book?.reference_num} />
            </div>
            <div className="field">
                <label htmlFor="" className="font-bold">Set Status</label>
                <Dropdown 
                    options={status} 
                    optionLabel="name" 
                    optionValue="code" 
                    value={selectedStatus} 
                    onChange={(e) => handleSelectStatus(e.value)} 
                    checkmark={true}
                    disabled={book?.set_status === 1 ? true : false} 
                    
                    />
                
            </div>
            <div className="field">
                {error && <Message severity="warn" text="Must choose status" />}
            </div>
            {selectedStatus === "Rejected" && (
            <div className="field">
                    <label htmlFor="remarks" className="font-bold">Remarks</label>
                    <InputText id="remarks" required value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            )}

        </Dialog>

        <Dialog 
        visible={showViewBaptism} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Baptism Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={baptismModalFooter}
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

        </Dialog>

        <Dialog 
        visible={showViewWedding} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Wedding Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={weddingModalFooter}
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
        </Dialog>

        <Dialog 
        visible={showViewMemorial} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Memorial Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={memorialModalFooter}
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
        </Dialog>

        <Dialog 
        visible={showViewConfirmation} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Confirmation Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={confirmationModalFooter}
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
        </Dialog>

        <Dialog 
        visible={showViewMass} 
        style={{ width: '32rem' }} 
        breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
        header={`Mass Details - ${formData?.reference_num}`}
        modal
        className="p-fluid"
        footer={massModalFooter}
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
        </Dialog>
            </>
        ) : (
            <>
            <div className="flex justify-center items-center">
                <MoonLoader size={50} />
            </div>

            </>
        )}

    </div>
    
    
    </>
  )

  
    

}