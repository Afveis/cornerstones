
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Indicator, GlobalConfig } from '../types';
import { initialIndicators, initialGlobalConfig } from './initialState';
import { useIndicatorActions } from './hooks/useIndicatorActions';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  addNewIndicator: () => void;
}

const IndicatorContext = createContext<IndicatorContextType | undefined>(undefined);

export const IndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [activeIndicator, setActiveIndicator] = useState<number>(1);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(initialGlobalConfig);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);
  const [lastSaveTime, setLastSaveTime] = useState<number>(0);
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

  // Auto-save when indicators change
  useEffect(() => {
    const autoSave = async () => {
      // Check if we should save (throttle to once every 2 seconds)
      const now = Date.now();
      if (now - lastSaveTime < 2000 || !user) return;
      
      try {
        await saveIndicatorData(indicators);
        setLastSaveTime(now);
      } catch (error) {
        console.error('Error auto-saving indicator data:', error);
        toast.error('Failed to save your progress. Please try again.');
      }
    };

    // Don't auto-save on the initial load
    if (lastSaveTime > 0) {
      autoSave();
    } else if (user) {
      setLastSaveTime(Date.now());  // Set initial time to prevent immediate save
    }
  }, [indicators, user, saveIndicatorData, lastSaveTime]);

  // Function to manually save indicator progress
  const saveProgress = async () => {
    if (user) {
      try {
        await saveIndicatorData(indicators);
        setLastSaveTime(Date.now());
        toast.success('Progress saved successfully!');
      } catch (error) {
        console.error('Error saving indicator data:', error);
        toast.error('Failed to save your progress. Please try again.');
      }
    } else {
      toast.error('You need to be logged in to save your progress.');
    }
  };

  // Add new indicator function
  const addNewIndicator = () => {
    const highestId = indicators.reduce((max, indicator) => Math.max(max, indicator.id), 0);
    const newId = highestId + 1;
    
    // Clone the structure from the first indicator but with new ID and empty values
    const newIndicator: Indicator = {
      id: newId,
      name: `Indicator ${newId}`,
      centerImage: "/placeholder.svg", // Default placeholder image
      groups: globalConfig.themeCount > 0 
        ? Array.from({ length: globalConfig.themeCount }).map((_, index) => {
            // Calculate how many slices each group should have
            const numSlices = 4; // Default to 4 slices per group or use a value from globalConfig
            return {
              label: `Theme ${index + 1}`,
              color: `hsl(${(index * 360) / globalConfig.themeCount}, 70%, 50%)`, // Generate different colors
              rankingColor: `hsl(${(index * 360) / globalConfig.themeCount}, 70%, 80%)`,
              slices: Array.from({ length: numSlices }).map(() => ({
                label: "",
                progress: 0,
                color: `hsl(${(index * 360) / globalConfig.themeCount}, 70%, 50%)`,
                rankingColor: `hsl(${(index * 360) / globalConfig.themeCount}, 70%, 80%)`,
                description: ""
              })),
              sliceCount: numSlices // Add the missing sliceCount property
            };
          })
        : []
    };
    
    setIndicators(prev => [...prev, newIndicator]);
    setActiveIndicator(newId);
    toast.success(`New indicator created: Indicator ${newId}`);
  };

  // Create wrapped versions of the action functions that will trigger UI updates
  const wrappedActions = {
    updateSliceProgress: (groupIndex: number, sliceIndex: number, progress: number) => {
      actions.updateSliceProgress(groupIndex, sliceIndex, progress);
      // Immediate UI updates are handled by the state updates in updateSliceProgress
    },
    updateThemeConfig: (themeIndex: number, color?: string, rankingColor?: string, sliceCount?: number, label?: string) => {
      actions.updateThemeConfig(themeIndex, color, rankingColor, sliceCount, label);
      // Immediate UI updates are handled by the state updates in updateThemeConfig
    },
    updateGlobalConfig: (newThemeCount?: number, newSliceCount?: number) => {
      actions.updateGlobalConfig(newThemeCount, newSliceCount);
      // Immediate UI updates are handled by the state updates in updateGlobalConfig
    },
    updateIndicatorName: (id: number, name: string) => {
      actions.updateIndicatorName(id, name);
      // Immediate UI updates are handled by the state updates in updateIndicatorName
    },
    updateSliceLabel: (groupIndex: number, sliceIndex: number, label: string) => {
      actions.updateSliceLabel(groupIndex, sliceIndex, label);
      // Immediate UI updates are handled by the state updates in updateSliceLabel
    },
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
        ...wrappedActions,
        saveProgress,
        loadingUserData,
        addNewIndicator
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
