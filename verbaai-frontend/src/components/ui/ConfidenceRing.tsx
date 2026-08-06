interface ConfidenceRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const ConfidenceRing = ({
  value,
  size = 140,
  strokeWidth = 10,
  color = "#4F46E5",
}: ConfidenceRingProps) => {
  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">

      <svg
        width={size}
        height={size}
      >

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
        >
          {value}%
        </text>

      </svg>

    </div>
  );
};

export default ConfidenceRing;