export interface Mail {
 
 
  id: string;
  created:Date;
  to: string;
  from: string;
  subject: string;
  body: string;
  sent: boolean;
  important: boolean;
  isFavourite: boolean;
  completed:boolean;
  selected:boolean;
  folderName:string;
  attachment?: File;
  recipientName?: string;
  read:boolean;

}

