
import React, { useState } from 'react';
import { CircleDiagram } from '../CircleDiagram';
import { IndicatorCard } from '../IndicatorCard';
import { useIndicator } from '../context/IndicatorContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export const DiagramSection = () => {
  const {
    indicators,
    activeIndicator,
    setActiveIndicator,
    globalConfig,
    activeIndicatorData,
    updateGlobalConfig,
    updateThemeConfig,
    updateSliceProgress,
    addNewIndicator,
  } = useIndicator();

  const [currentPage, setCurrentPage] = useState(0);
  const indicatorsPerPage = 5;
  const totalPages = Math.ceil(indicators.length / indicatorsPerPage);
  
  const visibleIndicators = indicators.slice(
    currentPage * indicatorsPerPage, 
    (currentPage + 1) * indicatorsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 border border-[#CBCBCB] rounded-lg flex items-center justify-center p-8 bg-white">
        <CircleDiagram 
          groups={activeIndicatorData.groups}
          groupCount={globalConfig.themeCount}
          onUpdateGroupCount={count => updateGlobalConfig(count)}
          onUpdateGroupConfig={updateThemeConfig}
          onUpdateProgress={updateSliceProgress}
          centerImage={activeIndicatorData.centerImage}
        />
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevPage} 
              disabled={currentPage === 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-2 text-sm">
              {currentPage + 1} / {totalPages || 1}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPage} 
              disabled={currentPage >= totalPages - 1}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 flex gap-2 w-full overflow-x-auto">
            {visibleIndicators.map((indicator) => (
              <IndicatorCard
                key={indicator.id}
                indicator={indicator}
                isActive={activeIndicator === indicator.id}
                onClick={() => setActiveIndicator(indicator.id)}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={addNewIndicator}
            className="h-8 w-8"
            title="Add new indicator"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
