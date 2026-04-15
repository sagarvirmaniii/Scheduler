import React from 'react';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-7 h-7 border-[2.5px] border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}
