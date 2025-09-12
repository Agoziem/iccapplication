"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Define types for Excel export data
type ExcelData = Record<string, any>[] | any[][];

interface UseJsonToExcelReturn {
  excelfilename: string;
  setExcelFileName: (name: string) => void;
  isjsonArray: boolean;
  setIsJsonArray: (isArray: boolean) => void;
  loadingexcel: boolean;
  handleExport: (data: ExcelData) => void;
}

const useJsonToExcel = (): UseJsonToExcelReturn => {
  const [excelfilename, setExcelFileName] = useState<string>('MyExcelfile'); // set the excel file name
  const [isjsonArray, setIsJsonArray] = useState<boolean>(false); // Check if the data is an array of objects or an array of arrays
  const [loadingexcel, setLoadingExcel] = useState<boolean>(false);
  
  const handleExport = (data: ExcelData): void => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn('No data provided for Excel export');
      return;
    }

    console.log(isjsonArray);
    setLoadingExcel(true);
    
    try {
      const ws = !isjsonArray 
        ? XLSX.utils.json_to_sheet(data as Record<string, any>[])
        : XLSX.utils.aoa_to_sheet(data as any[][]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${excelfilename}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setLoadingExcel(false);
    }
  };

  return {
    excelfilename,
    setExcelFileName,
    isjsonArray,
    setIsJsonArray,
    loadingexcel, 
    handleExport
  };
};

export default useJsonToExcel;

