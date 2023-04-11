export class Client {

    id: number;
    label: string;
    value:number;
    nom: string="";
    prenom: string="" ;
    date_naissance: string="";
    telephone: string="";
    email:string="";
    rue:string="";
    ville:string="";
    npa:string="";

    constructor(nom: string, prenom: string, date_naissance: string, id: number,telephone: string,email:string,rue:string,ville:string,npa:string){
        this.nom = nom;
        this.prenom = prenom;
        this.date_naissance = date_naissance;
        this.id = id;
        this.telephone=telephone;
        this.email=email;
        this.rue=rue;
        this.ville=ville;
        this.npa=npa;
        this.label=this.prenom+" "+this.nom;
        this.value=this.id;
    }


}