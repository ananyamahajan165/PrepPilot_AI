interface WaveformProps {
  active?: boolean;
}

const Waveform = ({ active = true }: WaveformProps) => {
  const bars = [35, 55, 25, 70, 45, 80, 30, 65, 40, 75, 50, 60];

  return (
    <div className="flex items-end justify-center gap-1 h-24">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-2 rounded-full ${
            active ? "bg-indigo-600" : "bg-gray-300"
          } ${active ? "animate-pulse" : ""}`}
          style={{
            height: `${height}px`,
            animationDelay: `${index * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;