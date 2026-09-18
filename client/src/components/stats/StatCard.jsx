// C:\secure-online-voting-system\client\src\components\stats\StatCard.jsx
const StatCard = ({ icon, value, label, barColor, bar, iconBg, iconColor }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
      <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-3 ${iconColor}`}>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 mb-3">{label}</p>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${bar}%` }}
        />
      </div>
    </div>
  );
};

export default StatCard;