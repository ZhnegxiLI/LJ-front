import { Injectable } from '@angular/core';

@Injectable()
export class UtilsProvider {

  constructor() {
    
  }
  
  hasPermission(permissionList,permission){
    var hasPermission:boolean = false;
    permissionList.forEach(val => {
      if(val.permissionCode== permission){
          hasPermission = true;
      }
    });
    return hasPermission;
  }
  

}
