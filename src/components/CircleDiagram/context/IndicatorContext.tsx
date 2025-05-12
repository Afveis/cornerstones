
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Indicator, GlobalConfig } from '../types';
import { initialIndicators, initialGlobalConfig } from './initialState';
import { useIndicatorActions } from './hooks/useIndicatorActions';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  updateSliceLabel: (groupIndex: number, sliceIndex: number, label: string) => void;
  saveProgress: () => Promise<void>;
  loadingUserData: boolean;
}

const IndicatorContext = createContext<IndicatorContextType | undefined>(undefined);

export const IndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(initialGlobalConfig);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);
  const { user, saveIndicatorData } = useAuth();

  const activeIndicatorData = indicators.find((indicator) => indicator.id === activeIndicator) || indicators[0];

  const actions = useIndicatorActions(
    setIndicators,
    setGlobalConfig,
    activeIndicator,
    globalConfig
  );

  // Load user data when user signs in
  useEffect(() => {
    async function loadUserData() {
      if (!user) return;

      try {
        setLoadingUserData(true);
        const { data, error } = await supabase
          .from('user_indicators')
          .select('indicator_data')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') { // No rows returned
            console.error('Error loading user data:', error);
          }
          return;
        }

        if (data && data.indicator_data) {
          // Use proper type casting to handle the JSON data
          const indicatorData = data.indicator_data as unknown;
          
          if (Array.isArray(indicatorData) && 
              indicatorData.length > 0 && 
              typeof indicatorData[0] === 'object' && 
              indicatorData[0] !== null &&
              'id' in indicatorData[0] && 
              'name' in indicatorData[0] && 
              'groups' in indicatorData[0]) {
            // Cast to Indicator[] after validation
            setIndicators(indicatorData as unknown as Indicator[]);
          } else {
            console.error('Loaded data does not match expected Indicator structure', indicatorData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoadingUserData(false);
      }
    }

    loadUserData();
  }, [user]);

  // Function to save indicator progress
  const saveProgress = async () => {
    if (user) {
      await saveIndicatorData(indicators);
    }
  };

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
        ...actions,
        saveProgress,
        loadingUserData
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
