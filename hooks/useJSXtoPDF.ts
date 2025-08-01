"use client";
import { useState, useTransition } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface UseJsxToPdfReturn {
  loading: boolean;
  generatePdf: (jsxComponent: HTMLElement, pdfname?: string) => Promise<void>;
}

const useJsxToPdf = (): UseJsxToPdfReturn => {
  const [loading, setLoading] = useTransition();

  const generatePdf = async (jsxComponent: HTMLElement, pdfname?: string): Promise<void> => {
    setLoading(async () => {
      try {
        const canvas = await html2canvas(jsxComponent, {
          scale: 2, // Increase the scale for higher DPI
          logging: false, // Disable logging to improve performance
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const scaleFactor = Math.min(
          pageWidth / jsxComponent.offsetWidth,
          pageHeight / jsxComponent.offsetHeight
        );
        const scaledWidth = jsxComponent.offsetWidth * scaleFactor;
        const scaledHeight = jsxComponent.offsetHeight * scaleFactor;

        pdf.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
        pdf.save(`${pdfname || "Document"}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      }
    });
  };

  return { loading, generatePdf };
};

export default useJsxToPdf;
