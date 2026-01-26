export interface HouseType {
    id: number;
    typeName: string;
}

export interface HouseTypeResponse {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: HouseType[];
}

export interface HouseTypeParams {
    Search?: string;
    sort?: string;
    pageSize?: number;
    pageIndex?: number;
}

// Service Categories
export interface ServiceCategory {
    id: number;
    name: string;
    icon?: string;
}

export interface ServiceCategoryResponse {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: ServiceCategory[];
}

export interface ServiceCategoryParams {
    Search?: string;
    sort?: string;
    pageSize?: number;
    pageIndex?: number;
}
