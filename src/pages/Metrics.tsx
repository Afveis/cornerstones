
import React, { useState } from "react";
import { CircleChart } from "@/components/CircleChart/CircleChart";
import { CSVUploader } from "@/components/CircleChart/CSVUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  category: string;
  quote: string;
}

const Metrics = () => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  const handleDataLoad = (data: DataPoint[]) => {
    setChartData(data);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
        <p className="text-muted-foreground">
          Visualize survey data and feedback with interactive circle charts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Upload Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Data Upload</CardTitle>
            <CardDescription>
              Upload a CSV file to visualize your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CSVUploader onDataLoad={handleDataLoad} />
          </CardContent>
        </Card>

        {/* Chart Panel */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Agreement Visualization</CardTitle>
            <CardDescription>
              {chartData.length > 0 
                ? `Showing ${chartData.length} data points across categories`
                : "Upload a CSV file to see your data visualization"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <CircleChart data={chartData} />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground border border-dashed rounded-lg">
                <div className="text-center space-y-2">
                  <div className="text-lg">No data to display</div>
                  <div className="text-sm">Upload a CSV file to get started</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
