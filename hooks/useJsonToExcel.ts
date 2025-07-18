"use client";
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface UseJsonToExcelReturn {
  loadingexcel: boolean;
  excelfilename: string;
  setExcelFileName: (filename: string) => void;
  isjsonArray: boolean;
  setIsJsonArray: (isArray: boolean) => void;
  handleExport: (data: Record<string, any>[] | any[][]) => void;
}

const useJsonToExcel = (): UseJsonToExcelReturn => {
  const [excelfilename, setExcelFileName] = useState<string>('MyExcelfile'); // set the excel file name
  const [isjsonArray, setIsJsonArray] = useState<boolean>(false); // Check if the data is an array of objects or a array of array
  const [loadingexcel, setLoadingExcel] = useState<boolean>(false);
  
  const handleExport = (data: Record<string, any>[] | any[][]): void => {
    console.log(isjsonArray);
    setLoadingExcel(true);
    
    const ws = !isjsonArray 
      ? XLSX.utils.json_to_sheet(data as Record<string, any>[])
      : XLSX.utils.aoa_to_sheet(data as any[][]);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    setLoadingExcel(false);
    XLSX.writeFile(wb, `${excelfilename}.xlsx`);
  };

  return { 
    loadingexcel, 
    excelfilename,
    setExcelFileName,
    isjsonArray,
    setIsJsonArray,
    handleExport 
  };
};

export default useJsonToExcel;

