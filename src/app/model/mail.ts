export interface Mail {
 
  id: string;
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

}

