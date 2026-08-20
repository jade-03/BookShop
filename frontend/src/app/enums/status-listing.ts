export enum StatusListing {
    For_Sale = 'for_sale',
    Sold = 'sold',
}


export const Status = [
    { value: StatusListing.For_Sale, label: 'A Vendre' },
    { value: StatusListing.Sold, label: 'Vendu' },
]