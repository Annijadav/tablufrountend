import DropDown from '@/components/DropDown';
import { getDepartments } from '@/helpers/Services/Department_services';
import { getAllDesignation } from '@/helpers/Services/Designation_services';
import { Button, Divider } from '@nextui-org/react';
import { Clapperboard, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

function FilterEmployee({handleEmloyeeFilters}) {
    const employeeStatusKeys = {
        All : 'Show All',
        Active : 'Active',
        Inactive : 'InActive',
        Terminated : 'Terminated'
      };
      const employeeTypeKeys ={
        All : 'Show All',
        Permanent:'Permanent',
        Contract:'Contract',
        Third_Party:'Third Party',
        Consultant:'Consultant',
        Freelancer:'Freelancer'
      }
      const employeeGenderKeys = {
        All : 'Show All',
        Male:'Male',
        Female:'Female',
        Others : 'Others'
      }
      const [department, setDepartment] = useState({ All: 'Show All' });
      const [designation,setDesignation] = useState({ All: 'Show All' });
      const getDepartmentsList = async () => {
        try {
          const response = await getDepartments();
    
          if (response.status === 200) {
            const alldepartment = response.data.reduce((acc,value)=>{
                acc[value._id] = value.name;
                return acc;
            },{All:'Show All'})
            setDepartment(alldepartment)
          } else {
            console.log(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      const getDesignations = async () => {
        try {
          const response = await getAllDesignation();
    
          if (response.status === 200) {
            const designations = response.data.reduce((acc, designation) => {
                acc[designation._id] = designation.name;
                return acc;
              }, { All: 'Show All' });
              setDesignation(designations)
          } else {
            console.log(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      const clearfilter =()=>{
        // employeeStatusKeys=All;
        // employeeTypeKeys=All;
        // employeeGenderKeys=All;
      }
      useEffect(()=>{
        getDesignations();
        getDepartmentsList();
        
      },[])

  return (
    <div className='border-dashed border-2 rounded m-1 p-2 bg-white'>
     
     <div class="container  rounded-lg">
     <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <div className='text-center overflow-hidden'>
              Employee Status<br/>
              <DropDown keyToDisplay={employeeStatusKeys}
              defaultSelectedKey="All" // Optionally provide default selected key
              onChangeFilter={(key)=>handleEmloyeeFilters(key,"employeeStatusKeys")}/>
            </div>
            
            <div className='text-center overflow-hidden'>
              Employee Type<br/>
              <DropDown keyToDisplay={employeeTypeKeys}
              defaultSelectedKey="All" // Optionally provide default selected key
              onChangeFilter={(key)=>handleEmloyeeFilters(key,"employeeTypeKeys")}/>
            </div>
            
            <div className='text-center overflow-hidden'>
              Gender<br/>
              <DropDown keyToDisplay={employeeGenderKeys}
              defaultSelectedKey="All" // Optionally provide default selected key
              onChangeFilter={(key)=>handleEmloyeeFilters(key,"employeeGenderKeys")}/>
            </div>
            
            <div className='text-center overflow-hidden'>
              Department<br/>
              <DropDown keyToDisplay={department}
              defaultSelectedKey="All" // Optionally provide default selected key
              onChangeFilter={(key)=>handleEmloyeeFilters(key,"employeeDepartmentKeys")}/>
            </div>
            
            <div className='text-center overflow-hidden'>
              Designation<br/>
              <DropDown keyToDisplay={designation}
              defaultSelectedKey="All" // Optionally provide default selected key
              onChangeFilter={(key)=>handleEmloyeeFilters(key,"employeeDesignationKeys")}/>
            </div>
            <div className='text-center overflow-hidden'>
              <br/>
          <Button onClick={()=>{handleEmloyeeFilters("","clear"),clearfilter()}} isIconOnly color="danger" variant="faded" aria-label="Take a photo">
          <Trash2 />
      </Button>
      </div>
          </div>
          </div>
    </div>
  )
}

export default FilterEmployee
