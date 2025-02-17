
import React, { createContext, useContext, useState } from 'react';
import { Indicator, GlobalConfig } from '../types';
import { initialIndicators, initialGlobalConfig } from './initialState';
import { useIndicatorActions } from './hooks/useIndicatorActions';

interface IndicatorContextType {
  indicators: Indicator[];
  setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>;
  activeIndicator: number;
  setActiveIndicator: React.Dispatch<React.SetStateAction<number>>;
  globalConfig: GlobalConfig;
  setGlobalConfig: React.Dispatch<React.SetStateAction<GlobalConfig>>;
  activeIndicatorData: Indicator;
  updateSliceProgress: (groupIndex: number, sliceIndex: number, progress: number) => void;
  updateThemeConfig: (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number, label?: string) => void;
  updateGlobalConfig: (newThemeCount?: number, newSliceCount?: number) => void;
  updateIndicatorName: (id: number, name: string) => void;
}

const IndicatorContext = createContext<IndicatorContextType | undefined>(undefined);

export const IndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(initialGlobalConfig);

  const activeIndicatorData = indicators.find((indicator) => indicator.id === activeIndicator) || indicators[0];

  const actions = useIndicatorActions(
    setIndicators,
    setGlobalConfig,
    activeIndicator,
    globalConfig
  );

  return (
    <IndicatorContext.Provider
      value={{
        indicators,
        setIndicators,
        activeIndicator,
        setActiveIndicator,
        globalConfig,
        setGlobalConfig,
        activeIndicatorData,
        ...actions
      }}
    >
      {children}
    </IndicatorContext.Provider>
  );
};

export const useIndicator = () => {
  const context = useContext(IndicatorContext);
  if (context === undefined) {
    throw new Error('useIndicator must be used within an IndicatorProvider');
  }
  return context;
};
