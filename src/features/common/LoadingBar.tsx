const LoadingBar = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-vividSkyBlue rounded-full animate-wave animation-delay-200" />
      <div className="w-2 h-2 bg-vividSkyBlue rounded-full animate-wave animation-delay-400" />
      <div className="w-2 h-2 bg-vividSkyBlue rounded-full animate-wave animation-delay-600" />
    </div>
  </div>
);

export default LoadingBar;
