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

    const actionBodyTemplate = (rowData) => {
        return(
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editStatus(rowData)} />
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