"use client";
import React, {useState} from 'react';
import * as XLSX from 'xlsx';

const useJsonToExcel = () => {
  const [excelfilename, setExcelFileName] = useState('MyExcelfile'); // set the excel file name
  const [isjsonArray, setIsJsonArray] = useState(false); // Check if the data is an array of objects or a array of array
  const [loadingexcel, setLoadingExcel] = useState(false);
  
  const handleExport = (data) => {
    console.log(isjsonArray)
    setLoadingExcel(true);
    const ws = !isjsonArray ? XLSX.utils.json_to_sheet(data): XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    setLoadingExcel(false);
    XLSX.writeFile(wb,`${excelfilename}.xlsx`);
  };

 
  return {loadingexcel, handleExport};
};

export default useJsonToExcel;

