import React from 'react';

type TabUiProps = {
  onOpenCanvas: () => void;
};

export const TabUi: React.FC<TabUiProps> = ({ onOpenCanvas }) => {
  return (
    <div>
      <p>Welcome to robot simulator.</p>
      <button
        onClick={() => {
          onOpenCanvas();
        }}
      >
        Open simulation
      </button>
    </div>
  );
};
