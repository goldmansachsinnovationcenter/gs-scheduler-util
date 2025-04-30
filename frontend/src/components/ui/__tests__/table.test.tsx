import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table';

describe('Table Components', () => {
  describe('Table', () => {
    it('should render correctly', () => {
      const { container } = render(<Table>Test Table</Table>);
      const tableContainer = container.firstChild as HTMLElement;
      const table = tableContainer.firstChild as HTMLElement;
      
      expect(tableContainer).toBeInTheDocument();
      expect(tableContainer).toHaveAttribute('data-slot', 'table-container');
      expect(tableContainer).toHaveClass('relative');
      expect(tableContainer).toHaveClass('w-full');
      expect(tableContainer).toHaveClass('overflow-x-auto');
      
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-slot', 'table');
      expect(table).toHaveClass('w-full');
      expect(table).toHaveClass('caption-bottom');
      expect(table).toHaveClass('text-sm');
    });

    it('should apply custom className to the table element', () => {
      const { container } = render(<Table className="custom-class">Test Table</Table>);
      const table = container.querySelector('[data-slot="table"]');
      
      expect(table).toHaveClass('custom-class');
    });

    it('should pass additional props to the table element', () => {
      const { container } = render(
        <Table data-testid="test-table" id="table-id">
          Test Table
        </Table>
      );
      const table = container.querySelector('[data-slot="table"]');
      
      expect(table).toHaveAttribute('id', 'table-id');
      expect(table).toHaveAttribute('data-testid', 'test-table');
    });
  });

  describe('TableHeader', () => {
    it('should render correctly', () => {
      const { container } = render(<TableHeader>Header Content</TableHeader>);
      const header = container.firstChild as HTMLElement;
      
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute('data-slot', 'table-header');
      expect(header).toHaveClass('[&_tr]:border-b');
      expect(header).toHaveTextContent('Header Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableHeader className="custom-class">Header Content</TableHeader>
      );
      const header = container.firstChild as HTMLElement;
      
      expect(header).toHaveClass('custom-class');
    });

    it('should pass additional props to the thead element', () => {
      const { container } = render(
        <TableHeader data-testid="test-header" id="header-id">
          Header Content
        </TableHeader>
      );
      const header = container.firstChild as HTMLElement;
      
      expect(header).toHaveAttribute('id', 'header-id');
      expect(header).toHaveAttribute('data-testid', 'test-header');
    });
  });

  describe('TableBody', () => {
    it('should render correctly', () => {
      const { container } = render(<TableBody>Body Content</TableBody>);
      const body = container.firstChild as HTMLElement;
      
      expect(body).toBeInTheDocument();
      expect(body).toHaveAttribute('data-slot', 'table-body');
      expect(body).toHaveClass('[&_tr:last-child]:border-0');
      expect(body).toHaveTextContent('Body Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableBody className="custom-class">Body Content</TableBody>
      );
      const body = container.firstChild as HTMLElement;
      
      expect(body).toHaveClass('custom-class');
    });

    it('should pass additional props to the tbody element', () => {
      const { container } = render(
        <TableBody data-testid="test-body" id="body-id">
          Body Content
        </TableBody>
      );
      const body = container.firstChild as HTMLElement;
      
      expect(body).toHaveAttribute('id', 'body-id');
      expect(body).toHaveAttribute('data-testid', 'test-body');
    });
  });

  describe('TableFooter', () => {
    it('should render correctly', () => {
      const { container } = render(<TableFooter>Footer Content</TableFooter>);
      const footer = container.firstChild as HTMLElement;
      
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('data-slot', 'table-footer');
      expect(footer).toHaveClass('bg-muted/50');
      expect(footer).toHaveClass('border-t');
      expect(footer).toHaveClass('font-medium');
      expect(footer).toHaveTextContent('Footer Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableFooter className="custom-class">Footer Content</TableFooter>
      );
      const footer = container.firstChild as HTMLElement;
      
      expect(footer).toHaveClass('custom-class');
    });

    it('should pass additional props to the tfoot element', () => {
      const { container } = render(
        <TableFooter data-testid="test-footer" id="footer-id">
          Footer Content
        </TableFooter>
      );
      const footer = container.firstChild as HTMLElement;
      
      expect(footer).toHaveAttribute('id', 'footer-id');
      expect(footer).toHaveAttribute('data-testid', 'test-footer');
    });
  });

  describe('TableRow', () => {
    it('should render correctly', () => {
      const { container } = render(<TableRow>Row Content</TableRow>);
      const row = container.firstChild as HTMLElement;
      
      expect(row).toBeInTheDocument();
      expect(row).toHaveAttribute('data-slot', 'table-row');
      expect(row).toHaveClass('hover:bg-muted/50');
      expect(row).toHaveClass('data-[state=selected]:bg-muted');
      expect(row).toHaveClass('border-b');
      expect(row).toHaveClass('transition-colors');
      expect(row).toHaveTextContent('Row Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableRow className="custom-class">Row Content</TableRow>
      );
      const row = container.firstChild as HTMLElement;
      
      expect(row).toHaveClass('custom-class');
    });

    it('should pass additional props to the tr element', () => {
      const { container } = render(
        <TableRow data-testid="test-row" id="row-id">
          Row Content
        </TableRow>
      );
      const row = container.firstChild as HTMLElement;
      
      expect(row).toHaveAttribute('id', 'row-id');
      expect(row).toHaveAttribute('data-testid', 'test-row');
    });
  });

  describe('TableHead', () => {
    it('should render correctly', () => {
      const { container } = render(<TableHead>Head Content</TableHead>);
      const head = container.firstChild as HTMLElement;
      
      expect(head).toBeInTheDocument();
      expect(head).toHaveAttribute('data-slot', 'table-head');
      expect(head).toHaveClass('text-foreground');
      expect(head).toHaveClass('h-10');
      expect(head).toHaveClass('px-2');
      expect(head).toHaveClass('text-left');
      expect(head).toHaveClass('align-middle');
      expect(head).toHaveClass('font-medium');
      expect(head).toHaveTextContent('Head Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableHead className="custom-class">Head Content</TableHead>
      );
      const head = container.firstChild as HTMLElement;
      
      expect(head).toHaveClass('custom-class');
    });

    it('should pass additional props to the th element', () => {
      const { container } = render(
        <TableHead data-testid="test-head" id="head-id">
          Head Content
        </TableHead>
      );
      const head = container.firstChild as HTMLElement;
      
      expect(head).toHaveAttribute('id', 'head-id');
      expect(head).toHaveAttribute('data-testid', 'test-head');
    });
  });

  describe('TableCell', () => {
    it('should render correctly', () => {
      const { container } = render(<TableCell>Cell Content</TableCell>);
      const cell = container.firstChild as HTMLElement;
      
      expect(cell).toBeInTheDocument();
      expect(cell).toHaveAttribute('data-slot', 'table-cell');
      expect(cell).toHaveClass('p-2');
      expect(cell).toHaveClass('align-middle');
      expect(cell).toHaveClass('whitespace-nowrap');
      expect(cell).toHaveTextContent('Cell Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableCell className="custom-class">Cell Content</TableCell>
      );
      const cell = container.firstChild as HTMLElement;
      
      expect(cell).toHaveClass('custom-class');
    });

    it('should pass additional props to the td element', () => {
      const { container } = render(
        <TableCell data-testid="test-cell" id="cell-id">
          Cell Content
        </TableCell>
      );
      const cell = container.firstChild as HTMLElement;
      
      expect(cell).toHaveAttribute('id', 'cell-id');
      expect(cell).toHaveAttribute('data-testid', 'test-cell');
    });
  });

  describe('TableCaption', () => {
    it('should render correctly', () => {
      const { container } = render(<TableCaption>Caption Content</TableCaption>);
      const caption = container.firstChild as HTMLElement;
      
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveAttribute('data-slot', 'table-caption');
      expect(caption).toHaveClass('text-muted-foreground');
      expect(caption).toHaveClass('mt-4');
      expect(caption).toHaveClass('text-sm');
      expect(caption).toHaveTextContent('Caption Content');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <TableCaption className="custom-class">Caption Content</TableCaption>
      );
      const caption = container.firstChild as HTMLElement;
      
      expect(caption).toHaveClass('custom-class');
    });

    it('should pass additional props to the caption element', () => {
      const { container } = render(
        <TableCaption data-testid="test-caption" id="caption-id">
          Caption Content
        </TableCaption>
      );
      const caption = container.firstChild as HTMLElement;
      
      expect(caption).toHaveAttribute('id', 'caption-id');
      expect(caption).toHaveAttribute('data-testid', 'test-caption');
    });
  });

  describe('Complete Table', () => {
    it('should render a complete table with all components', () => {
      const { container } = render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Header 1</TableHead>
              <TableHead>Header 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell 1</TableCell>
              <TableCell>Cell 2</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer 1</TableCell>
              <TableCell>Footer 2</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      
      const tableContainer = container.querySelector('[data-slot="table-container"]');
      const table = container.querySelector('[data-slot="table"]');
      const caption = container.querySelector('[data-slot="table-caption"]');
      const header = container.querySelector('[data-slot="table-header"]');
      const body = container.querySelector('[data-slot="table-body"]');
      const footer = container.querySelector('[data-slot="table-footer"]');
      const rows = container.querySelectorAll('[data-slot="table-row"]');
      const heads = container.querySelectorAll('[data-slot="table-head"]');
      const cells = container.querySelectorAll('[data-slot="table-cell"]');
      
      expect(tableContainer).toBeInTheDocument();
      expect(table).toBeInTheDocument();
      expect(caption).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(body).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
      expect(rows).toHaveLength(3);
      expect(heads).toHaveLength(2);
      expect(cells).toHaveLength(4);
      
      expect(caption).toHaveTextContent('Table Caption');
      expect(heads[0]).toHaveTextContent('Header 1');
      expect(heads[1]).toHaveTextContent('Header 2');
      expect(cells[0]).toHaveTextContent('Cell 1');
      expect(cells[1]).toHaveTextContent('Cell 2');
      expect(cells[2]).toHaveTextContent('Footer 1');
      expect(cells[3]).toHaveTextContent('Footer 2');
    });
  });
});
