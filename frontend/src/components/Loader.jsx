const sizeMap = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const Loader = ({ size = "md", className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
      />
    </div>
  );
};

export default Loader;
