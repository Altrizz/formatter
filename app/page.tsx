'use client';

import React, { useState } from 'react';
import { CVPreview } from '@/components/cv-preview';
import { CVData } from '@/lib/types';
import { FileUp, FileText, Download, Sparkles, Loader2, ArrowRight, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

const FORMAT_OPTIONS = [
  "Algo One-Page",
  "Algo Detailed",
  "Marketing / Growth",
  "Creative / Design",
  "Technical / Automation"
];

const REFINE_OPTIONS = [
  "Shorten & make more concise",
  "Add more detail and metrics",
  "Make tone more senior and strategic",
  "Make more creative and dynamic",
  "Make more technical and analytical"
];

export default function AppPage() {
  const [rawText, setRawText] = useState("");
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [format, setFormat] = useState(FORMAT_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [languages, setLanguages] = useState("");

  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setRawText(""); // Clear text if file uploaded

    if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (event) => {
           const base64 = (event.target?.result as string).split(',')[1];
           setFileData(base64);
           setFileMimeType(file.type);
        };
        reader.readAsDataURL(file);
    } else if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
           setRawText(event.target?.result as string);
           setFileData(null);
           setFileMimeType(null);
        };
        reader.readAsText(file);
    } else {
        alert("Please upload a PDF or TXT file, or paste the text directly.");
        setFileName(null);
    }
  };

  const handleGenerate = async () => {
    if (!rawText && !fileData) {
      alert("Please paste CV text or upload a PDF/TXT file first.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          fileData,
          fileMimeType,
          format,
          notes,
          name,
          title,
          languages
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate CV");
      }

      const data = await res.json();
      setCvData(data);
    } catch (error: any) {
      console.error(error);
      alert(`There was an error generating the CV: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!cvData) return;
    
    setIsRefining(true);
    try {
      const res = await fetch('/api/refine-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          instruction
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to refine CV");
      }

      const data = await res.json();
      setCvData(data);
    } catch (error: any) {
       console.error(error);
       alert(`Error refining the CV: ${error.message}`);
    } finally {
       setIsRefining(false);
    }
  };

  const handlePrint = () => {
     window.print();
  };

  const updateCVData = (partial: Partial<CVData>) => {
     setCvData(prev => prev ? { ...prev, ...partial } : null);
  };

  return (
    <div className="h-[100dvh] bg-[#F4F7F9] text-[#1a1a1a] font-sans overflow-hidden">
      <div className="flex h-full w-full">
         
         {/* Left Panel - Inputs - hidden when printing */}
         <aside className="w-full lg:w-[340px] shrink-0 bg-white border-r border-[#E2E8F0] p-6 flex flex-col gap-5 overflow-y-auto no-print z-10 shadow-[4px_0_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 font-extrabold text-[18px] tracking-tight">
               <div className="w-6 h-6 rounded-md bg-gradient-to-r from-[#35F4C5] via-[#60B3D8] to-[#8A71EE]"></div>
               ALGO FORMATTER
            </div>

            <div className="flex flex-col gap-2 relative">
               <label className="text-[12px] font-[700] uppercase text-[#64748B] tracking-[0.5px]">Format</label>
               <select 
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-[14px] p-2.5 border border-[#E2E8F0] rounded-lg bg-white outline-none focus:border-[#35F4C5]"
               >
                  {FORMAT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[12px] font-[700] uppercase text-[#64748B] tracking-[0.5px]">Paste CV Text</label>
               {fileName && <div className="text-sm font-medium text-[#35F4C5] mb-1">{fileName} uploaded</div>}
               <textarea 
                  className="w-full h-[180px] p-3 border border-[#E2E8F0] rounded-lg text-[13px] resize-none bg-[#F8FAFC] text-[#475569] outline-none box-border focus:border-[#35F4C5]"
                  placeholder="Paste the candidate's raw CV content here..."
                  value={rawText}
                  onChange={(e) => {
                     setRawText(e.target.value);
                     if (e.target.value) {
                        setFileData(null);
                        setFileMimeType(null);
                        setFileName(null);
                     }
                  }}
               />
               <label className="cursor-pointer text-[12px] font-semibold text-[#60B3D8] hover:underline mt-1">
                  Or upload PDF / TXT
                  <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} />
               </label>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[12px] font-[700] uppercase text-[#64748B] tracking-[0.5px]">Optional Notes</label>
               <input type="text" placeholder="e.g. Focus on leadership roles" className="w-full text-[14px] p-2.5 border border-[#E2E8F0] rounded-lg bg-white outline-none focus:border-[#35F4C5]" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button 
               onClick={handleGenerate}
               disabled={isGenerating || (!rawText && !fileData)}
               className="mt-2 bg-gradient-to-r from-[#35F4C5] via-[#60B3D8] to-[#8A71EE] text-white py-[14px] border-none rounded-lg font-[700] cursor-pointer text-center shadow-[0_4px_10px_rgba(96,179,216,0.3)] disabled:opacity-60 transition"
            >
               {isGenerating ? "FORMATTING..." : "RESTRUCTURE WITH AI"}
            </button>

            <div className="mt-auto pt-6 text-[11px] text-[#94A3B8] text-center">
               Powered by Algo Branding Engine v2.4
            </div>
         </aside>

         {/* Right Panel - Canvas - takes full width when printing */}
         <main className="flex-1 bg-[#E2E8F0] flex flex-col items-center p-[30px] overflow-hidden overflow-y-auto relative print:bg-white print:p-0">
            
            {/* AI Refinement Actions Toolbar (Only shows if generated) */}
            <div className="w-full max-w-[210mm] mb-3 flex justify-between items-center no-print">
               <div className="flex gap-1.5 flex-wrap">
                  {cvData && REFINE_OPTIONS.slice(0, 4).map(opt => (
                     <button 
                        key={opt}
                        onClick={() => handleRefine(opt)}
                        disabled={isRefining}
                        className="bg-white border border-[#CBD5E1] px-2.5 py-1 rounded-full text-[11px] font-[600] text-[#64748B] cursor-pointer hover:border-[#35F4C5] hover:text-[#35F4C5] transition disabled:opacity-50 whitespace-nowrap"
                     >
                        {isRefining ? '...' : opt.split(' ')[0]}
                     </button>
                  ))}
               </div>
               <div className="text-[12px] text-[#64748B] font-[600] whitespace-nowrap pl-4">A4 Preview (1:1)</div>
            </div>

            {/* The printable A4 component */}
            <div className={cn("relative transition-opacity duration-300", isRefining && "opacity-60 pointer-events-none")}>
               {(isGenerating || isRefining) && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center no-print">
                     <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-[#60B3D8] animate-spin mb-3" />
                        <p className="text-sm font-bold text-gray-800">{isRefining ? 'Refining content...' : 'Structuring CV...'}</p>
                        <p className="text-xs text-gray-500 mt-1">This usually takes a few seconds.</p>
                     </div>
                  </div>
               )}
               
               <div className="shadow-2xl bg-white mb-20 min-h-[297mm]">
                  <CVPreview data={cvData} updateData={updateCVData} />
               </div>
            </div>

            {/* Editing Tip */}
            {cvData && !isGenerating && !isRefining && (
               <button 
                  onClick={handlePrint}
                  className="absolute bottom-6 right-6 bg-[#1a1a1a] text-white px-5 py-3 rounded-full text-[13px] font-[600] flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-black transition no-print"
               >
                  <Download className="w-4 h-4" />
                  Download PDF
               </button>
            )}
            
         </main>
      </div>
    </div>
  );
}
