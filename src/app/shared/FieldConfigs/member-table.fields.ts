export interface memberHeader {
    key:string;
    label:string;
}

export interface Member {
    id:number;
    name:string;
    email:string;
    status:string;
    profession: string;
}

export const memberHeaders : memberHeader[] =[
    { key: 'id', label: 'No.' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
    { key: 'profession', label: 'Profession' }, // New header for Profession
    { key: 'edit', label: 'Edit' },
    { key: 'block', label: 'Block/Unblock' }
]
