export interface TableColumn {
    key: string;
    header: string;
    type?: 'text' | 'number' | 'date' | 'badge' | 'boolean' | 'image' | 'custom';
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    badgeConfig?: {
        colorMap?: { [key: string]: { bg: string; text: string } };
        defaultColor?: { bg: string; text: string };
    };
}

export interface TableAction {
    icon: string;
    label: string;
    tooltip?: string;
    color?: string;
    condition?: (row: any) => boolean;
    action: (row: any) => void;
}