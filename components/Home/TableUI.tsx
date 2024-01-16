import React, { ReactNode } from 'react';

interface TableComponentProps {
    children: ReactNode;
    className?: string;
}

export const Table: React.FC<TableComponentProps> = ({ children, className }) => {
    return <table className={`w-full ${className}`}>{children}</table>;
};

export const TableRow: React.FC<TableComponentProps> = ({ children, className }) => {
    return <tr className={className}>{children}</tr>;
};

export const TableCell: React.FC<TableComponentProps> = ({ children, className }) => {
    return <td className={`${className} p-1`}>{children}</td>;
};

export const TableBody: React.FC<TableComponentProps> = ({ children, className }) => {
    return <tbody className={className}>{children}</tbody>;
};

export const TableHeader: React.FC<TableComponentProps> = ({ children, className }) => {
    return <thead className={className}>{children}</thead>;
};

export const TableHead: React.FC<TableComponentProps> = ({ children, className }) => {
    return <th className={`font-extrabold text-left pb-2 ${className}`}>{children}</th>;
};