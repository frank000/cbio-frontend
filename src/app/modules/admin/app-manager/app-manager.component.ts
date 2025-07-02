import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { colDef } from '@bhplugin/ng-datatable'; 
import { GridAbstract } from '../../base/grid-controller/grid-abstract.controller';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/shared.module';
import { showMessage } from '../../base/showMessage';
import Swal from 'sweetalert2'; 
import { ContainerInfo } from 'src/app/shared/models/docker.model';
import { DockerManagementService } from 'src/app/service/docker-management.service';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './app-manager.component.html',
  styleUrl: './app-manager.component.css'
})
export class AppManagerComponent extends GridAbstract {

  gridRows: ContainerInfo[] = [];
  totalRows!: number;
  
  cols: Array<colDef> = [];
  swalWithBootstrapButtons: any;

  _dockerService = inject(DockerManagementService);
  _router = inject(Router); 
 

  constructor() {
    super();
    this.initColumns();
    this.loadContainers();
    this.initSwal();
  }

  initColumns() {
    this.cols = [
      { field: "id", title: "Container ID", width: '200px', filter: false },
      { field: "name", title: "Nome" },
      { field: "image", title: "Imagem" },
      { field: "status", title: "Status" },
      { field: "state", title: "Estado" },
      { field: "ports", title: "Portas", filter: false },
      { field: "actions", title: "Ações", filter: false, sort: false }
    ];
  }

  initSwal() {
    this.swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: false,
      customClass: {
        popup: 'sweet-alerts',
        confirmButton: 'btn btn-secondary',
        cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
      },
    });
  }

  loadContainers() {
    this._dockerService.listAllContainers().subscribe({
      next: (containers) => {
        this.gridRows = containers;
        this.totalRows = containers.length;
      },
      error: (err) => {
        showMessage('Erro ao carregar containers: ' + err.message, 'error');
      }
    });
  }

  restartContainer(containerId: string) {
    this.swalWithBootstrapButtons.fire({
      title: 'Reiniciar Container',
      text: 'Tem certeza que deseja reiniciar este container?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, reiniciar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._dockerService.restartContainer(containerId).subscribe({
          next: () => {
            showMessage('Container reiniciado com sucesso');
            this.loadContainers();
          },
          error: (err) => {
            showMessage('Erro ao reiniciar container: ' + err.message, 'error');
          }
        });
      }
    });
  }

  rebuildContainer(container: ContainerInfo) {
    const imageName = container.image.split(':')[0];
    const port = container.ports.length > 0 ? container.ports[0].hostPort : '5005';

    this.swalWithBootstrapButtons.fire({
      title: 'Recriar Container',
      text: 'Isso irá reconstruir a imagem e recriar o container. Continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, recriar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this._dockerService.rebuildAndRestartContainer(container.name, imageName, port).subscribe({
          next: () => {
            showMessage('Container recriado com sucesso');
            this.loadContainers();
          },
          error: (err) => {
            showMessage('Erro ao recriar container: ' + err.message, 'error');
          }
        });
      }
    });
  }

  // Override dos métodos abstratos (não utilizados neste contexto)
  override getService(): any { return null; }
  override setGridRows(rows: any): void {}
  override setTotalGrid(total: number): void {}
  override getParamsPage(): any { return {}; }
  override getParamsFiltro(): any { return {}; }
 
  downloadLogs(containerId: string) {
  this._dockerService.downloadContainerLogs(containerId).subscribe({
    next: (logs:any) => {
      this.saveLogsToFile(logs, containerId);
    },
    error: (err:any) => {
      console.error('Erro ao baixar logs:', err);
      showMessage('Erro ao baixar logs', 'error');
    }
  });
}

private saveLogsToFile(logs: string, containerId: string) {
  const blob = new Blob([logs], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs_${containerId}_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  
  window.URL.revokeObjectURL(url);
  a.remove();
  
  showMessage('Logs baixados com sucesso');
}
}