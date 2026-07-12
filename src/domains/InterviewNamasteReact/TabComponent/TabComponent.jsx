import React from "react";

const TABS = [
  { id: 1, label: "Tab 1", content: "Content for Tab 1", bgColor: "#c1fff8" },
  { id: 2, label: "Tab 2", content: "Content for Tab 2", bgColor: "#ffd9f0" },
  { id: 3, label: "Tab 3", content: "Content for Tab 3", bgColor: "#fbb7b7" },
];

const TabComponent = () => {
  const [activeTab, setActiveTab] = React.useState(TABS[0].id);
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #464647",
        borderRadius: "20px",
        backgroundColor: "#d8d8d8",
        minHeight: "500px",
      }}
    >
      <div>
        {TABS.map((tab) => (
          <button
            style={{
              backgroundColor: "white",
              color: "black",
              marginRight: "2px",
              borderBottom: activeTab === tab.id ? "2px solid blue" : "none",
              borderRadius: "0px",
            }}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #464647",
          borderRadius: "20px",
          backgroundColor: activeTab
            ? TABS.find((tab) => tab.id === activeTab)?.bgColor
            : "transparent",
        }}
      >
        {activeTab && (
          <div>{TABS.find((tab) => tab.id === activeTab)?.content}</div>
        )}
      </div>
    </div>
  );
};

export default TabComponent;
