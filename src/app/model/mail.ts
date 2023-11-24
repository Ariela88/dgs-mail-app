export interface Mail {
 
 
  id: string;
  created:Date;
  to: string;
  from: string;
  subject: string;
  body: string;
  sent: boolean;
  important: boolean;
  isFavorite: boolean;
  completed:boolean;
  selected:boolean;
  folderName:string;
  attachment?: File;
  recipientName?: string;
  read:boolean;
  selectable:boolean

}

