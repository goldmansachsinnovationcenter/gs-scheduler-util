import React from 'react';

export const MockButton = ({ children, onClick, className }) => (
  <button onClick={onClick} className={className} data-testid="mock-button">
    {children}
  </button>
);

export const MockInput = ({ value, onChange, placeholder, className }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
    data-testid="mock-input"
  />
);

export const MockForm = ({ onSubmit, children }) => (
  <form onSubmit={onSubmit} data-testid="mock-form">
    {children}
  </form>
);

export const MockTable = ({ children }) => (
  <table data-testid="mock-table">{children}</table>
);

export const MockTableHeader = ({ children }) => (
  <thead data-testid="mock-table-header">{children}</thead>
);

export const MockTableBody = ({ children }) => (
  <tbody data-testid="mock-table-body">{children}</tbody>
);

export const MockTableRow = ({ children }) => (
  <tr data-testid="mock-table-row">{children}</tr>
);

export const MockTableCell = ({ children }) => (
  <td data-testid="mock-table-cell">{children}</td>
);

export const MockBadge = ({ children, variant }) => (
  <span data-testid={`mock-badge-${variant}`}>{children}</span>
);

export const MockLoadingBackdrop = ({ isOpen }) => (
  isOpen ? <div data-testid="mock-loading-backdrop">Loading...</div> : null
);

export const MockTabs = ({ children, defaultValue }) => (
  <div data-testid="mock-tabs" data-default-value={defaultValue}>
    {children}
  </div>
);

export const MockTabsList = ({ children }) => (
  <div data-testid="mock-tabs-list">{children}</div>
);

export const MockTabsTrigger = ({ children, value }) => (
  <button data-testid={`mock-tab-trigger-${value}`}>{children}</button>
);

export const MockTabsContent = ({ children, value }) => (
  <div data-testid={`mock-tab-content-${value}`}>{children}</div>
);
