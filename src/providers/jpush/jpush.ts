
import { Injectable } from '@angular/core';

import { JPush } from 'ionic3-jpush';

/*
  Generated class for the JpushProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JpushProvider {

  constructor(
    public jPush: JPush) {
    console.log('Hello JpushProvider Provider');
  }

  initJpush() {

    this.jPush.init();

    this.jPush.receiveMessage().subscribe(
      data => {
        console.log("receive message event : " + data);
      },
      error => {
        console.log(error);
      }

    );

    this.jPush.receiveNotification().subscribe(
      data => {
        console.log("receive notification event : " + data);
      },
      error => {
        console.log(error);
      }
    )

  }

  //设置极光推送应用别名，添加标签
  /* tslint:disable */
  setAlias(userId) {
    this.jPush.setAlias({ sequence: 1, alias: userId }).then(result => {
      console.log('jpush-设置别名成功:');
      console.log(JSON.stringify(result));
    }, error => {
      console.log(JSON.stringify(error))
    })
  }

  deleteAlias() {
    this.jPush.deleteAlias({ sequence: 2 }).then(result => {
      console.log('jpush-删除别名成功:');
      console.log(result);
    }, error => {
      console.log('jpush-设删除别名失败:', error);
    })
  }

  setTags(tags: Array<string> = []) {
    this.jPush.setTags({sequence: 3, tags}).then(result => {
      console.log('jpush-设置标签成功:');
      console.log(result);
    }, error => {
      console.log('jpush-设置标签失败:', error);
    })
  }

  deleteTags(tags: Array<string> = []) {
    this.jPush.deleteTags({sequence: 4}).then(result => {
      console.log('jpush-删除标签成功:');
      console.log(result);
    }, error => {
      console.log('jpush-删除标签失败:', error);
    })
  }

  getAllTags(){
    this.jPush.getAllTags({sequence: 5}).then(result => {
      console.log("my tags : ");
      console.log(result);
    }, error => {
      console.log('error :', error);
    });
  }

  cleanTags(){
    this.jPush.cleanTags({sequence: 6}).then(result => {
      console.log("clean tags : ");
      console.log(result);
    },error =>{
      console.log("error : ",error);
    })
  }

  // // 设置ios应用角标数量
  // setIosIconBadgeNumber(badgeNumber) {
  //   if (this.nativeService.isIos()) {
  //     this.jPush.setBadge(badgeNumber); // 上传badge值到jPush服务器
  //     this.jPush.setApplicationIconBadgeNumber(badgeNumber); // 设置应用badge值
  //   }
  // }

  // 点击通知进入应用程序时会触发的事件
  // openNotification(): Observable<any>{
  //   return new Observable(observer => {
  //     document.addEventListener('jpush.openNotification', (event: any) => {
  //       observer.next(event);  
  //     }, false)
  //   });

  // }

}
