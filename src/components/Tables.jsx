import React from 'react';
import StudentTable from './StudentTable';
import TeacherTable from './TeacherTable';
import GradeTable from './GradeTable';
import SectionTable from './SectionTable';
import AddTable from './AddTable'; // Import AddTable component

export default function Tables() {
  return (
    <div className="p-4 bg-green-500 h-screen w-screen overflow-auto"> {/* Full height & width container with green background */}      
      {/* Top row: AddTable, GradeTable, and SectionTable beside each other */}
      <div className="flex justify-between mb-4 h-1/2 space-x-4"> {/* Flexbox layout with gap */} 
        <div className="flex-1 overflow-hidden">
          <AddTable />
        </div>
        <div className="flex-1 overflow-hidden">
          <GradeTable />
        </div>
        <div className="flex-1 overflow-hidden">
          <SectionTable />
        </div>
      </div>

      {/* Bottom row: StudentTable and TeacherTable beside each other */}
      <div className="flex justify-between h-1/2 space-x-4"> {/* Flexbox layout with gap */}
        <div className="flex-1 overflow-hidden">
          <StudentTable />
        </div>
        <div className="flex-1 overflow-hidden">
          <TeacherTable />
        </div>
      </div>
    </div>
  );
}
