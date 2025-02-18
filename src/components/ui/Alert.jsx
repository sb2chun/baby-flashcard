import React from 'react';

const Alert = ({ type, children }) => {
  let alertStyle = '';

  switch (type) {
    case 'success':
      alertStyle = 'bg-green-100 text-green-700 border-green-300';
      break;
    case 'error':
      alertStyle = 'bg-red-100 text-red-700 border-red-300';
      break;
    case 'warning':
      alertStyle = 'bg-yellow-100 text-yellow-700 border-yellow-300';
      break;
    case 'info':
      alertStyle = 'bg-blue-100 text-blue-700 border-blue-300';
      break;
    default:
      alertStyle = 'bg-blue-100 text-blue-700 border-blue-300';
  }

  return (
    <div className={`border-l-4 p-4 ${alertStyle} rounded-md shadow-sm`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => {
  return <div className="mt-2 text-sm">{children}</div>;
};

export { Alert, AlertDescription };
