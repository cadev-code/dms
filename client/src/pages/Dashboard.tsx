import { Sidebar } from '@/components/dms/Sidebar';
import { useState } from 'react';

export const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        documentCounts={{ excel: 1, word: 5, pdf: 12, other: 15 }}
      />
    </div>
  );
};
