import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { showMessage } from './modules/base/showMessage';
import { MessageService } from './service/message.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    swalWithBootstrapButtons:any;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private titleService: Title,
    ) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route) => {
                    while (route.firstChild) route = route.firstChild;
                    return route;
                }),
                filter((route) => route.outlet === 'primary'),
                switchMap((route) => {
                    return route.data.pipe(
                        map((routeData: any) => {
                            const title = routeData['title'];
                            return { title };
                        }),
                    );
                }),
                tap((data: any) => {
                    let title = data.title;
                    title = (title ? title + ' | ' : '') + 'RAYZA.bot {soluções inteligentes}';
                    this.titleService.setTitle(title);
                }),
            )
            .subscribe();
                  
 
    }
    ngOnInit(): void {
        this.messageService.message$
        .subscribe((ret:any)=>{
          console.log("ret", ret);
          setTimeout(
            () => {
                showMessage(
                  ret.msg,
                  (ret.tipo != undefined)?  ret.tipo : 'success'
              );
              },
            500
          
          );
       
    
        })
    }
}
