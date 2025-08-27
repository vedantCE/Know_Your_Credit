import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const AnimatedSpeedometer = ({ bureauName, score, range, peerAverage, postAverage, size = "large", bureauStatus = 'UP' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  
  // Parse min and max from range string (support both – and -)
  const [minScore, maxScore] = range.replace(/–/g, '-').split('-').map(s => Number(s.trim()));

  // Ensure score is within bounds and calculate percentage
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const percent = (clampedScore - minScore) / (maxScore - minScore);
  
  // Animation effect
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;
    const scoreIncrement = clampedScore / steps;
    const percentIncrement = percent / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.round(scoreIncrement * currentStep));
      setAnimatedPercent(percentIncrement * currentStep);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedScore(clampedScore);
        setAnimatedPercent(percent);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [clampedScore, percent]);

  // SVG dimensions based on size
  const dimensions = size === "large" ? 
    { width: 200, height: 120, centerX: 100, centerY: 100, radius: 80 } :
    { width: 140, height: 90, centerX: 100, centerY: 100, radius: 80 };

  const { width, height, centerX, centerY, radius } = dimensions;

  // Calculate needle angle (from 180deg to 0deg) using animated percent
  const angle = 180 - animatedPercent * 180;
  const needleLength = radius - 9;
  const rad = (angle * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(rad);
  const needleY = centerY - needleLength * Math.sin(rad);

  // Helper for arc path
  const describeArc = (x, y, r, startAngle, endAngle) => {
    const start = {
      x: x + r * Math.cos((Math.PI * startAngle) / 180),
      y: y + r * Math.sin((Math.PI * startAngle) / 180),
    };
    const end = {
      x: x + r * Math.cos((Math.PI * endAngle) / 180),
      y: y + r * Math.sin((Math.PI * endAngle) / 180),
    };
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-4">
      <CardContent className="p-0">
        {/* Bureau Header */}
        <div className="text-center mb-4">
          <h3 className={`${size === "large" ? "text-lg" : "text-base"} font-semibold text-gray-800 mb-2`}>
            {bureauName} Score
          </h3>
          <div className={`${size === "large" ? "text-3xl" : "text-2xl"} font-bold text-blue-800`}>
            {animatedScore}
          </div>
          <div className={`${size === "large" ? "text-sm" : "text-xs"} text-gray-500 mt-1`}>
            Range: {range}
          </div>
          {bureauStatus === 'DOWN' && (
            <div className="text-xs text-red-600 font-medium mt-1 bg-red-50 px-2 py-1 rounded">
              Server Down - Last Cached Score
            </div>
          )}
          {bureauStatus === 'SLOW' && (
            <div className="text-xs text-yellow-600 font-medium mt-1 bg-yellow-50 px-2 py-1 rounded">
              Slow Response - Live Score
            </div>
          )}
        </div>

        {/* Semicircular Speedometer */}
        <div className="flex flex-col items-center mb-4">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Background arc */}
            <path
              d={describeArc(centerX, centerY, radius, 180, 0)}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Colored arc with gradient */}
            <defs>
              <linearGradient id={`gauge-gradient-${bureauName}`} x1="20" y1="100" x2="180" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id={`needle-gradient-${bureauName}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
            <path
              d={describeArc(centerX, centerY, radius, 180, 0)}
              fill="none"
              stroke={`url(#gauge-gradient-${bureauName})`}
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Professional Needle - Arrow Shape */}
            <polygon
              points={`${centerX},${centerY-3} ${needleX-8},${needleY} ${centerX},${centerY+3} ${centerX+12},${centerY}`}
              fill={`url(#needle-gradient-${bureauName})`}
              stroke="#991b1b"
              strokeWidth="1"
            />
            {/* Needle center circle */}
            <circle cx={centerX} cy={centerY} r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="3" fill="#991b1b" />
            
            {/* Min/Max labels */}
            <text x={centerX - radius + 10} y={centerY + 20} fontSize={size === "large" ? "12" : "10"} fill="#6b7280" textAnchor="start">{minScore}</text>
            <text x={centerX + radius - 10} y={centerY + 20} fontSize={size === "large" ? "12" : "10"} fill="#6b7280" textAnchor="end">{maxScore}</text>
            {/* Poor/Excellent labels */}
            <text x={centerX - radius + 10} y={centerY + 40} fontSize={size === "large" ? "12" : "10"} fill="#ef4444" textAnchor="start">Poor</text>
            <text x={centerX + radius - 10} y={centerY + 40} fontSize={size === "large" ? "12" : "10"} fill="#22c55e" textAnchor="end">Excellent</text>
          </svg>
        </div>

        {/* Comparison Metrics */}
        {peerAverage && postAverage && (
          <div className="grid grid-cols-2 gap-4">
            {/* Peer Average */}
            <div className="text-center">
              <h4 className={`${size === "large" ? "text-sm" : "text-xs"} font-medium text-gray-700 mb-2`}>Peer</h4>
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${peerAverage}%` }}
                  ></div>
                </div>
                <div className={`${size === "large" ? "text-xs" : "text-[10px]"} text-gray-600`}>Average {peerAverage}%</div>
              </div>
            </div>

            {/* Post Average */}
            <div className="text-center">
              <h4 className={`${size === "large" ? "text-sm" : "text-xs"} font-medium text-gray-700 mb-2`}>Post</h4>
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${postAverage}%` }}
                  ></div>
                </div>
                <div className={`${size === "large" ? "text-xs" : "text-[10px]"} text-gray-600`}>Average {postAverage}%</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimatedSpeedometer;