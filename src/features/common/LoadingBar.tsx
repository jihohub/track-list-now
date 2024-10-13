const LoadingBar = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-lime-200 rounded-full animate-wave animation-delay-200" />
      <div className="w-2 h-2 bg-lime-200 rounded-full animate-wave animation-delay-400" />
      <div className="w-2 h-2 bg-lime-200 rounded-full animate-wave animation-delay-600" />
    </div>
  </div>
);

export default LoadingBar;
