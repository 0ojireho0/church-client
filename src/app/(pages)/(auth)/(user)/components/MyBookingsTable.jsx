import React, {useState, useEffect, useRef} from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { useUser } from "@/app/hooks/user";


function MyBookingsTable({user_id}) {

    const [selectedBookings, setSelectedBookings] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const { myBooks } = useUser({
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
                ${rowData.status === "Approved" ? "bg-green-600" : rowData.status === "Rejected" ? "bg-red-600" : "bg-yellow-400"}
                px-4 py-2 text-white rounded-lg
                `}>
                {rowData.status}
            </span>
            
            </>
        )
    }


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
                    </DataTable>
            </div>

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
