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
