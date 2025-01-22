import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { format, startOfMonth, subMonths } from 'date-fns';
import { SummaryService } from 'src/app/service/summary.service';
import { SharedModule } from 'src/shared.module';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent implements OnInit{
  revenueChart: any;
  attendanceByAttendants: any;
  store: any;
  isLoading = true;
  summaryService = inject(SummaryService);
  listAttendanceByAttendants: any[]=[];
  listAttendanceByMonth: any[]=[];
    listPeriod:any[] = []
    selectedPeriod:any;
    meses:string[] = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio",
                "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

    getFisrtDayFormated(minusMonth:number){
        const today = new Date();
        return format(startOfMonth(subMonths(today, minusMonth)), 'yyyy-MM-dd');
    }
    
    constructor(public storeData: Store<any>) {
        
    
    }

    ngOnInit(): void {
        this.initStore();
        this.isLoading = false;
    
        this.initChartDataAttendance();
    }



    private initChartDataAttendance() {
        this.listPeriod = [
            {
                endDate: this.getFisrtDayFormated(0),
                label: "Mês atual",
            },
            {
                endDate: this.getFisrtDayFormated(1),
                label: "Ultimo mês",
            },
            {
                endDate: this.getFisrtDayFormated(2),
                label: "2 Ultimos meses",
            }
        ];

        this.selectedPeriod = this.getFisrtDayFormated(0);
        this.loadChartAttendanceByAttendant(this.selectedPeriod);
        this.loadChartAttendancePerMonth();
    }

    public loadChartAttendanceByAttendant(formattedFirstDayOfMonth: any ) {

        const today = new Date();
        const formattedToday = format(today, 'yyyy-MM-dd');
        this.summaryService.getAttendanceByAttendantsPerPeriod(formattedFirstDayOfMonth, formattedToday)
            .subscribe((resp: any) => {
                this.listAttendanceByAttendants = resp;
                setTimeout(() => {
                    this.initCharts(); // refresh charts
                }, 300);
            });
    }

    public loadChartAttendancePerMonth() {
 
        this.summaryService.getAttendanceByAttendantsPerMonthAndYear()
            .subscribe((resp: any) => {
                console.log("this.listAttendanceByMonth ", this.listAttendanceByMonth);
                
                this.listAttendanceByMonth = resp;
                setTimeout(() => {
                    this.initCharts(); // refresh charts
                }, 300);
            });
    }

  async initStore() {
    
    this.storeData
        .select((d) => d.index)
        .subscribe((d) => {
            const hasChangeTheme = this.store?.theme !== d?.theme;
            const hasChangeLayout = this.store?.layout !== d?.layout;
            const hasChangeMenu = this.store?.menu !== d?.menu;
            const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

            this.store = d;

            if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                if (this.isLoading || hasChangeTheme) {
                    this.initCharts(); //init charts
                } else {
                    setTimeout(() => {
                        this.initCharts(); // refresh charts
                    }, 300);
                }
            }
        });
}

initCharts() {
    const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
    const isRtl = this.store.rtlClass === 'rtl' ? true : false;
       // revenue
       this.revenueChart = {
        chart: {
            height: 325,
            type: 'area',
            fontFamily: 'Nunito, sans-serif',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            curve: 'smooth',
            width: 2,
            lineCap: 'square',
        },
        dropShadow: {
            enabled: true,
            opacity: 0.2,
            blur: 10,
            left: -7,
            top: 22,
        },
        colors: isDark ? ['#2196f3', '#e7515a'] : ['#1b55e2', '#e7515a'],
        markers: {
            discrete: [
                {
                    seriesIndex: 0,
                    dataPointIndex: 6,
                    fillColor: '#1b55e2',
                    strokeColor: 'transparent',
                    size: 7,
                },
                {
                    seriesIndex: 1,
                    dataPointIndex: 5,
                    fillColor: '#e7515a',
                    strokeColor: 'transparent',
                    size: 7,
                },
            ],
        },
        labels: this.getLabelsAttendanceByMonth(),
        xaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            crosshairs: {
                show: true,
            },
            labels: {
                offsetX: isRtl ? 2 : 0,
                offsetY: 5,
                style: {
                    fontSize: '12px',
                    cssClass: 'apexcharts-xaxis-title',
                },
            },
        },
        yaxis: {
            tickAmount: 7,
            labels: {
                formatter: (value: number) => {
                    return value ;
                },
                offsetX: isRtl ? -30 : -10,
                offsetY: 0,
                style: {
                    fontSize: '12px',
                    cssClass: 'apexcharts-yaxis-title',
                },
            },
            opposite: isRtl ? true : false,
        },
        grid: {
            borderColor: isDark ? '#191e3a' : '#e0e6ed',
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '16px',
            markers: {
                width: 10,
                height: 10,
                offsetX: -2,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
        },
        tooltip: {
            marker: {
                show: true,
            },
            x: {
                show: false,
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: !1,
                opacityFrom: isDark ? 0.19 : 0.28,
                opacityTo: 0.05,
                stops: isDark ? [100, 100] : [45, 100],
            },
        },
        series: [
            {
                name: 'Atendimentos',
                data: this.contarFilhos(this.listAttendanceByMonth),
            }
        ],
    };
 
    this.attendanceByAttendants = {
        chart: {
            type: 'donut',
            height: 460,
            fontFamily: 'Nunito, sans-serif',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 25,
            colors: isDark ? '#0e1726' : '#fff',
        },
        colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '14px',
            markers: {
                width: 10,
                height: 10,
                offsetX: -2,
            },
            height: 50,
            offsetY: 20,
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '55%',
                    background: 'transparent',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '29px',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            fontSize: '26px',
                            color: isDark ? '#bfc9d4' : undefined,
                            offsetY: 16,
                            formatter: (val: any) => {
                                return val;
                            },
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#888ea8',
                            fontSize: '29px',
                            formatter: (w: any) => {
                                return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                    return a + b;
                                }, 0);
                            },
                        },
                    },
                },
            },
        },
        labels: this.getLabelsAttendanceByAttendants(),
        states: {
            hover: {
                filter: {
                    type: 'none',
                    value: 0.15,
                },
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0.15,
                },
            },
        },
        series: this.getValuesAttendanceByAttendants(),
    };

  }

  getLabelsAttendanceByAttendants(){ 
    
    return Object.keys(this.listAttendanceByAttendants);
  }
  getValuesAttendanceByAttendants(){
    let totalAttendances: number[] = [];
    for (let attendants of Object.values(this.listAttendanceByAttendants)) {
        let total = 0;
        for (const attendant of attendants) {
          total += attendant.qntAttendances;
        }
        // Armazenar o total em um array
        totalAttendances.push(total);
      }

      
    return totalAttendances;
  }

  getLabelsAttendanceByMonth(){
 
    return Object.keys(this.listAttendanceByMonth);
  }

  getValuesAttendanceByMonth(){
    this.listAttendanceByMonth
    .map(item =>{
        return item
    });
    return Object.keys(this.listAttendanceByMonth);
  }

  // Função para contar os filhos
   contarFilhos = (obj: any) => {
    const contagem: number[] = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if(obj[key].length <= 0 ){
                contagem.push(obj[key].length);
            }else{
                let subtotal = 0
                obj[key].forEach((item:any) => {
                    subtotal += item.qntAttendances;
                });
                contagem.push(subtotal);

            }
        }
    }
    return contagem;
};

}
