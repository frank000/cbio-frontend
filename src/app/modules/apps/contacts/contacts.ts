import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import Swal from 'sweetalert2';
import { NgxCustomModalComponent } from 'ngx-custom-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/service/contact.service';
import { showMessage } from '../../base/showMessage';
import { text } from 'stream/consumers';

@Component({
    templateUrl: './contacts.html',
    animations: [toggleAnimation],
    standalone: false
})
export class ContactsComponent implements OnInit{
    constructor(public fb: FormBuilder) {
        this.swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: false,
            customClass: {
                popup: 'sweet-alerts',
                confirmButton: 'btn btn-secondary',
                cancelButton: 'btn btn-dark ltr:mr-3 rtl:ml-3',
            },
          });
    }
    displayType = 'list';
    @ViewChild('addContactModal') addContactModal!: NgxCustomModalComponent;
    params!: FormGroup;
    contactService:ContactService = inject(ContactService);
    filterdContactsList: any = [];
    searchUser = '';
    mask12 =  ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    contactList:any[] = [
    ];

    initForm() {
        this.params = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.required],
            location: [''],
            obs: [''],
        });
    }

    ngOnInit() {

        this.initForm();
        this.search();
        this.searchContacts();
    }

    search(){
        this.contactService.getAll()
        .subscribe(
            (resp:any) =>{
                this.contactList = resp;
                this.filterdContactsList = this.contactList
            }
        );        
    }

    searchContacts() {
        this.filterdContactsList = this.contactList
        .filter((d) => 
            d.name.toLowerCase().includes(this.searchUser.toLowerCase()) ||
            d.phone.toLowerCase().includes(this.searchUser.toLowerCase()) ||
            d.email.toLowerCase().includes(this.searchUser.toLowerCase())
    );
    }

    editUser(user: any = null) {
        this.addContactModal.open();
        this.initForm();
        if (user) {
            this.params.setValue({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                obs: user.obs,
            });
        }
    }

    saveUser() {
        if (this.params.controls['name'].errors) {
            this.showMessage('Nome é obrigatório.', 'error');
            return;
        }
        if (this.params.controls['email'].errors) {
            this.showMessage('Email é obrigatório.', 'error');
            return;
        }
        if (this.params.controls['phone'].errors) {
            this.showMessage('Phone é obrigatório.', 'error');
            return;
        }

        let phone:string = this.params.controls['phone'].value;
        let rawPhone = phone.trim().replace("(","").replace(")","").replace("-","").replace(" ","");

        let findedContact = this.contactList.find((d) => d.phone === rawPhone);

        if(findedContact != undefined){
            this.swalWithBootstrapButtons
            .fire({
                title: 'Telefone duplicado',
                text:"Já existe um contato com esse celular/whatsapp cadastrado. Recomendamos pesquisar pelo numero antes para validar se trata-se do mesmo usuário. Deseja continuar?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                reverseButtons: true,
                padding: '2em',
            })
            .then((result:any) => {
                if (result.value) {
                    let user: any = this.processSaveUser();
                }  
            });
        }else{
            let user: any = this.processSaveUser();
        }
 



    }


  swalWithBootstrapButtons:any;
    private processSaveUser() {
        let user: any;

        if (this.params.value.id) {
            //update user
            user = this.contactList.find((d) => d.id === this.params.value.id);
            user.name = this.params.value.name;
            user.email = this.params.value.email;
            user.phone = this.params.value.phone;
            user.location = this.params.value.location;
            user.obs = this.params.value.obs;
        } else {
            //add user
            user = {
                path: null,
                name: this.params.value.name,
                email: this.params.value.email,
                phone: this.params.value.phone,
                location: this.params.value.location,
                obs: this.params.value.obs,
            };

            // this.contactList.splice(0, 0, user);
            this.searchContacts();
        }
        let action = user.id ? this.contactService.update(user) : this.contactService.save(user);

        action.subscribe(
            (resp: any) => {
                showMessage('Contato salvo com sucesso!');
                this.addContactModal.close();
                this.search();
            }
        );
        return user;
    }

    deleteUser(user: any = null) {

        this.swalWithBootstrapButtons
        .fire({
            title: 'Tem certeza que deseja excluir o contato?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: true,
            padding: '2em',
        })
        .then((result:any) => {
            if (result.value) {
                this.contactList = this.contactList.filter((d) => d.id != user.id);
                this.contactService.delete(user.id)
                .subscribe(
                    (resp:any) =>{
                        this.searchContacts();
                        this.showMessage('Contato excluido com sucesso.');
                    }
                );
            }  
        });


     

    }

    showMessage(msg = '', type = 'success') {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    }
}
