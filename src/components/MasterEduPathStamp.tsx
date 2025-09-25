import digitalStamp from "@/assets/masteredupath-digital-stamp.png";

interface MasterEduPathStampProps {
  size?: number;
  className?: string;
}

export default function MasterEduPathStamp({ 
  size = 120, 
  className = "" 
}: MasterEduPathStampProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={digitalStamp}
        alt="ختم وكالة ماستر إيدو باث الرقمي المعتمد"
        className="object-contain"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
        }}
        title="ختم رقمي معتمد - وكالة ماستر إيدو باث"
      />
    </div>
  );
}