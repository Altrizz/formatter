'use client';

import React from 'react';
import { CVData } from '@/lib/types';
import { cn } from '@/lib/utils';

// Helper component for contentEditable fields
const EditableText = ({ tag: Tag = 'span', value, onChange, className, multiline = false }: any) => {
  return (
    <Tag 
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
         // using innerText preserves newlines better for multiline, textContent for single line
         const newVal = multiline ? e.target.innerText : e.target.textContent;
         if (newVal !== value) {
            onChange(newVal || '');
         }
      }}
      className={cn("outline-transparent hover:bg-gray-100/50 focus:bg-gray-100 focus:ring-1 ring-[#35F4C5]/50 transition-all p-0.5 rounded -ml-0.5 inline-block whitespace-pre-wrap empty:min-w-[50px] empty:after:content-['(Empty)'] empty:after:text-gray-400 empty:after:italic cursor-text", className)}
    >
      {value}
    </Tag>
  );
};

export function CVPreview({ data, updateData }: { data: CVData | null, updateData: (partial: Partial<CVData>) => void }) {
  if (!data) {
    return (
      <div className="a4-page flex items-center justify-center bg-gray-50 border border-dashed border-gray-300">
        <div className="text-gray-400 text-center">
            <p className="mb-2">No CV Data Generated Yet</p>
            <p className="text-sm">Upload or paste your CV text to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="a4-page bg-white text-[#474646] font-sans relative overflow-hidden print-area leading-snug">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#35F4C5] via-[#60B3D8] to-[#8A71EE] px-8 py-6 flex flex-col justify-center min-h-[100px]">
         <EditableText 
            tag="h1" 
            value={data.name} 
            onChange={(name: string) => updateData({ name })}
            className="text-[28px] font-[800] text-white m-0 leading-none uppercase block hover:bg-white/20 focus:bg-white/20 ring-white/50" 
         />
         <EditableText 
            tag="h2" 
            value={data.title} 
            onChange={(title: string) => updateData({ title })}
            className="text-[14px] text-white/90 font-medium mt-1 block hover:bg-white/20 focus:bg-white/20 ring-white/50" 
         />
      </div>

      <div className="px-8 py-6 flex flex-col gap-[18px]">
        
        {/* Summary */}
        {data.summary && data.summary.length > 0 && (
          <section className="avoid-break group">
            <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">About Me / Summary</h3>
            <ul className="list-square list-outside ml-[14px] my-1 space-y-[2px] text-[11px] leading-[1.5]">
               {data.summary.map((item, i) => (
                 <li key={i}>
                    <EditableText 
                       value={item} 
                       multiline
                       onChange={(newVal: string) => {
                          const newArray = [...data.summary];
                          newArray[i] = newVal;
                          updateData({ summary: newArray });
                       }} 
                       className="w-full"
                    />
                 </li>
               ))}
            </ul>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="group">
            <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">Experience</h3>
            <div className="flex flex-col gap-2">
              {data.experience.map((exp, i) => (
                <div key={i} className="avoid-break mb-2">
                  <div className="flex justify-between font-[700] mb-[2px]">
                     <div className="flex gap-1 text-[11px]">
                        <EditableText value={exp.company} onChange={(v: string) => { const e = [...data.experience]; e[i].company = v; updateData({ experience: e }); }} className="font-semibold" /> — 
                        <EditableText value={exp.role} onChange={(v: string) => { const e = [...data.experience]; e[i].role = v; updateData({ experience: e }); }} className="font-medium" />
                     </div>
                     <span className="text-[11px] shrink-0 ml-4 tabular-nums">
                        <EditableText value={exp.date} onChange={(v: string) => { const e = [...data.experience]; e[i].date = v; updateData({ experience: e }); }} />
                     </span>
                  </div>
                  <ul className="list-square list-outside ml-[14px] my-1 space-y-[2px] text-[11px] leading-[1.5]">
                     {exp.bullets.map((b, bi) => (
                        <li key={bi}>
                           <EditableText 
                             value={b} 
                             multiline
                             onChange={(v: string) => { const e = [...data.experience]; e[i].bullets[bi] = v; updateData({ experience: e }); }} 
                             className="w-full"
                           />
                        </li>
                     ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-[10px]">
           {/* Left column for Skills, Technical */}
           <div className="flex flex-col gap-[18px]">
             {data.skills && data.skills.length > 0 && (
                <section className="avoid-break group">
                  <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">Skills</h3>
                  <ul className="list-square list-outside ml-[14px] my-1 space-y-[2px] text-[11px] leading-[1.5]">
                    {data.skills.map((skill, i) => (
                       <li key={i}>
                          <EditableText 
                             value={skill} 
                             onChange={(v: string) => { const s = [...data.skills]; s[i] = v; updateData({ skills: s }); }} 
                             className="w-full"
                          />
                       </li>
                    ))}
                  </ul>
                </section>
             )}

             {data.technicalSkills && data.technicalSkills.length > 0 && (
                <section className="avoid-break group">
                  <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">Technical Skills</h3>
                  <ul className="list-square list-outside ml-[14px] my-1 space-y-[2px] text-[11px] leading-[1.5]">
                    {data.technicalSkills.map((skill, i) => (
                       <li key={i}>
                          <EditableText 
                             value={skill} 
                             onChange={(v: string) => { const s = [...data.technicalSkills]; s[i] = v; updateData({ technicalSkills: s }); }} 
                             className="w-full"
                          />
                       </li>
                    ))}
                  </ul>
                </section>
             )}
           </div>

           {/* Right column for Education, Languages, Certs */}
           <div className="flex flex-col gap-[18px]">
              {data.education && data.education.length > 0 && (
                <section className="avoid-break group">
                  <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">Education</h3>
                  <div className="flex flex-col gap-[8px]">
                    {data.education.map((edu, i) => (
                      <div key={i} className="mb-1">
                        <div className="flex justify-between font-[700] mb-[2px] text-[11px]">
                          <EditableText value={edu.institution} onChange={(v: string) => { const e = [...data.education]; e[i].institution = v; updateData({ education: e }); }} className="flex-1" />
                          <EditableText value={edu.date} onChange={(v: string) => { const e = [...data.education]; e[i].date = v; updateData({ education: e }); }} className="shrink-0 ml-4" />
                        </div>
                        <div className="text-[10px] text-[#64748B]">
                           <EditableText value={edu.degree} onChange={(v: string) => { const e = [...data.education]; e[i].degree = v; updateData({ education: e }); }} className="w-full" multiline />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {data.certifications && data.certifications.length > 0 && (
                <section className="avoid-break group">
                  <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">Certifications</h3>
                  <ul className="list-square list-outside ml-[14px] my-1 space-y-[2px] text-[11px] leading-[1.5]">
                    {data.certifications.map((cert, i) => (
                      <li key={i}>
                         <EditableText value={cert} onChange={(v: string) => { const c = [...data.certifications]; c[i] = v; updateData({ certifications: c }); }} className="w-full" multiline />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {data.languages && data.languages.length > 0 && (
                <section className="avoid-break group">
                  <h3 className="text-[#35F4C5] text-[12px] font-[800] tracking-[1px] border-b border-[#F1F5F9] pb-1 mb-1.5 uppercase">Languages</h3>
                  <div className="text-[11px] leading-[1.5]">
                     {/* Because languages are joined natively, editing them inline as joined is hard. Better to join and let them edit the string */}
                     <EditableText 
                       value={data.languages.join(' • ')} 
                       onChange={(v: string) => updateData({ languages: v.split(' • ').map(s => s.trim()) })} 
                       className="w-full" 
                       multiline
                     />
                  </div>
                </section>
              )}
           </div>
        </div>
        
      </div>
    </div>
  );
}
