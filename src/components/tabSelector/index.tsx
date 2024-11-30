import React, { MouseEventHandler, ReactNode } from "react";

interface TabSelectorButtonProps {
    label: string;
    active?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

const TabSelectorButton = ({ label, active = false, onClick = () => {} } : TabSelectorButtonProps) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-4 rounded-t-lg ${
        active
          ? "bg-white text-black border-gray-100"
          : "bg-gray-100 text-gray-500 border-transparent"
      } focus:outline-none`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

interface Tab {
  label: string;
  component: ReactNode;
}

interface TabSelectorProps {
    tabs: Tab[];
    activeTab: number;
    onTabChange: (index: number) => void;
}

const TabSelector = ({ tabs, activeTab, onTabChange } : TabSelectorProps) => {
  return (
    <div>
        <div className="flex space-x-0">
            {tabs.map((tab, index) => (
                <TabSelectorButton
                key={index}
                label={tab.label}
                active={activeTab === index}
                onClick={() => onTabChange(index)}
                />
            ))}
        </div>
        {tabs[activeTab].component}
    </div>
  );
};

export default TabSelector;
